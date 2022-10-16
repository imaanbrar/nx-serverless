/* eslint-disable @typescript-eslint/ban-ts-comment */
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  TranscriptOrder,
  TranscriptOrderSection,
  Spelling,
} from '../../models/order.model';

interface Request {
  orderNumber: string;
  sections: TranscriptOrderSection[];
  spellings: Spelling[];
  isEnglish: boolean;
  isFrench: boolean;
}

export async function goToStep3(body: string): Promise<Record<string, any>> {
  const request = JSON.parse(body) as Request;

  // retrieve username from auth
  const username = 'imaanvirbrar';

  const order = new TranscriptOrder();
  const item = await order.getOrder(username, request.orderNumber);

  item.sections = request.sections;
  item.spellings = request.spellings;
  item.isEnglish = request.isEnglish;
  item.isFrench = request.isFrench;

  order.saveItem(item);

  return item;
}
