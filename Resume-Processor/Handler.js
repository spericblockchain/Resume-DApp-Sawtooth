"use strict";

const { TransactionHandler } = require("sawtooth-sdk/processor/handler"),
	{
		InvalidTransaction,
		InternalError
	} = require("sawtooth-sdk/processor/exceptions"),
	crypto = require("crypto"),
	{ TextEncoder, TextDecoder } = require("text-encoding/lib/encoding");

const encoder = new TextEncoder("utf8"),
	decoder = new TextDecoder("utf8");

function hash(data) {
	return crypto
		.createHash("sha512")
		.update(data)
		.digest("hex");
}

const FAMILY_NAME = "resume",
	NAMESPACE = hash(FAMILY_NAME).substring(0, 6);

function getAddress(publicKey) {
	const keyHash = hash(publicKey),
		nameHash = NAMESPACE + keyHash.slice(0, 64);
	return nameHash;
}

async function addResume(context, address, data) {
	const state = await context.getState([address]);
		const dataBytes = encoder.encode(JSON.stringify([data])),
			entries = {
				[address]: dataBytes
			};
		const Status = await context.setState(entries);
		context.addReceiptData(Buffer.from(Status, "utf8"));
		return Status;
}

async function updateResume(context, address, data) {
	const dataBytes = encoder.encode(JSON.stringify([data])),
		entries = {
			[address]: dataBytes
		};
	const Status = await context.setState(entries);
	context.addReceiptData(Buffer.from(Status, "utf8"));
	return Status;
}

//transaction handler class

class Handler extends TransactionHandler {
	constructor() {
		super(FAMILY_NAME, ["1.0"], [NAMESPACE]);
	}
	//apply function
	apply(transactionProcessRequest, context) {
		try {
			const header = transactionProcessRequest.header,
				userPublicKey = header.signerPublicKey,
				PayloadBytes = decoder.decode(transactionProcessRequest.payload),
				Payload = JSON.parse(PayloadBytes),
				address = getAddress(userPublicKey),
				action = Payload[0];

			if (action === 1) {
				return addResume(context, address, Payload[1]);
			} else if (action === 2) {
				return updateResume(context, address, Payload[1]);
			}
		} catch (err) {
			throw new InternalError(err);
		}
	}
}

module.exports = Handler;
