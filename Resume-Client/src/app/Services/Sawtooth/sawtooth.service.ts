import { ApiService } from 'src/app/Services/api/api.service';
import { Injectable } from '@angular/core';
import { CryptoFactory, createContext } from 'sawtooth-sdk/signing';
import { Secp256k1PrivateKey } from 'sawtooth-sdk/signing/secp256k1';
import * as crypto from 'crypto-browserify';
import { TextEncoder } from 'text-encoding/lib/encoding';
import protobuf from 'sawtooth-sdk/protobuf';

export interface TransactionModel {
  FAMILY_NAME: any;
  FAMILY_VERSION: any;
  inputList: any;
  outputList: any;
  privateKey: any;
  payload: any;
}

@Injectable( {
  providedIn: 'root'
} )
export class SawtoothService {
  // REST_API_BASE_URL = 'http://sawtooth-rest-api:8008'
  // REST_API_BASE_URL = '/batches'
  context: any;
  FAMILY_NAME: string;
  FAMILY_VERSION: string;
  encoder: any;

  constructor ( private api: ApiService ) {
    this.FAMILY_NAME = 'resume';
    this.FAMILY_VERSION = '1.0';
    this.encoder = new TextEncoder( 'utf8' );
    this.context = createContext( 'secp256k1' );
  }
  genPublickey = ( Key: string ) => {
    const key = Secp256k1PrivateKey.fromHex( Key );
    const signer = new CryptoFactory( this.context ).newSigner( key );
    return signer.getPublicKey().asHex();
  }
  hash = data => {
    return crypto
      .createHash( 'sha512' )
      .update( data )
      .digest( 'hex' );
  }
  genAddress = PublicKey => {
    const keyHash = this.hash( PublicKey );
    const nameHash = this.hash( this.FAMILY_NAME );
    return nameHash.slice( 0, 6 ) + keyHash.slice( 0, 64 );
  }
  createTransaction = async ( newTransaction: TransactionModel ) => {
    const secp256k1pk = Secp256k1PrivateKey.fromHex( newTransaction.privateKey.trim() );
    const signer = new CryptoFactory( this.context ).newSigner( secp256k1pk );
    const payloadBytes = this.encoder.encode( newTransaction.payload );
    // create transaction header
    const transactionHeaderBytes = protobuf.TransactionHeader.encode( {
      familyName: newTransaction.FAMILY_NAME,
      familyVersion: newTransaction.FAMILY_VERSION,
      inputs: newTransaction.inputList,
      outputs: newTransaction.outputList,
      signerPublicKey: signer.getPublicKey().asHex(),
      nonce: '' + Math.random(),
      batcherPublicKey: signer.getPublicKey().asHex(),
      dependencies: [],
      payloadSha512: this.hash( payloadBytes ),
    } ).finish();
    // create transaction
    const transaction = protobuf.Transaction.create( {
      header: transactionHeaderBytes,
      headerSignature: signer.sign( transactionHeaderBytes ),
      payload: payloadBytes,
    } );
    // create batch header
    const batchHeaderBytes = protobuf.BatchHeader.encode( {
      signerPublicKey: signer.getPublicKey().asHex(),
      transactionIds: [ transaction ].map( txn => txn.headerSignature ),
    } ).finish();
    // create batch
    const batch = protobuf.Batch.create( {
      header: batchHeaderBytes,
      headerSignature: signer.sign( batchHeaderBytes ),
      transactions: [ transaction ],
    } );
    // create batchlist
    const batchListBytes = protobuf.BatchList.encode( {
      batches: [ batch ],
    } ).finish();
    // return await this.sendTransaction( batchListBytes, batchHeaderBytes )
    return await this.api.postBatchList( batchListBytes, protobuf.BatchHeader.decode( batchHeaderBytes ) );
  }
  newTransaction = async ( privateKey: string, publicKey: string, data: string, action: number ) => {
    // const publicKey = this.genPublickey( privateKey );
    console.log( this.genPublickey( privateKey ) );
    console.log( "TCL: SawtoothService -> newTransaction -> publicKey", publicKey )
    const payload = JSON.stringify( [ action, data ] );
    console.log( "TCL: SawtoothService -> newTransaction -> payload", payload )
    const address = this.genAddress( publicKey );
    console.log( "TCL: SawtoothService -> newTransaction -> address", address )
    return await this.createTransaction(
      {
        FAMILY_NAME: this.FAMILY_NAME,
        FAMILY_VERSION: this.FAMILY_VERSION,
        inputList: [ ( this.hash( this.FAMILY_NAME ) ).substring( 0, 6 ) ],
        outputList: [ ( this.hash( this.FAMILY_NAME ) ).substring( 0, 6 ) ],
        privateKey,
        payload
      }
    );
  }
}
