export interface IRequest {
  _id: string;
  reqCode: string;
  client: any;
  property: any | string;
  createdAt: string;
  description: string;
  id: string;
  name: string;
  workingDays?: [string];
  workingHours?: {
    start: string;
    end: string;
  };
  status: string;
  type: string;
  updatedAt: string;
  createdBy: string;
}
