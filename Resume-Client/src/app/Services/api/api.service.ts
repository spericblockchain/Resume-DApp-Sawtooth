import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
@Injectable( {
  providedIn: 'root'
} )
export class ApiService {

  constructor ( private http: HttpClient ) { }
  getReceipt = async (id) => {
    try {
      const ReceiptResponse: any = await this.http.get( '/receipts?id=' + id ).toPromise()
      return ReceiptResponse
    } catch ( error ) {
      return error
    }
  }
  getStateData = async (stateAddress) => {
    try {
      const StateResponse: any = await this.http.get( '/state/' + stateAddress ).toPromise()
      return atob( StateResponse.data )
    } catch ( error ) {
      return error
    }

  }
  postBatchList = async ( batchListBytes, batchHeaderBytes ) => {
    const postBatchListURL = '/batches'
    const fetchOptions = {
      method: 'POST',
      body: batchListBytes,
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    }
    const res = await window.fetch( postBatchListURL, fetchOptions )
    return [ res, batchHeaderBytes ]
  }
}
