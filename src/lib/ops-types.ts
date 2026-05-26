/** Trạng thái nhân viên */
export type StaffStatus = "pending" | "active" | "inactive";

/** Trạng thái công việc */
export type JobStatus = "new" | "assigned" | "in_progress" | "done" | "cancelled";

export type StaffRecord = {
  staffId: string;
  name: string;
  phone: string;
  email: string;
  status: StaffStatus;
  registeredAt: string;
};

export type JobRecord = {
  jobId: string;
  customerName: string;
  phone: string;
  address: string;
  serviceNote: string;
  status: JobStatus;
  staffId: string;
  staffName: string;
  scheduledAt: string;
  createdAt: string;
  assignedAt: string;
};

export type StaffRegisterInput = {
  name: string;
  phone: string;
  email?: string;
  pin: string;
};

export type JobCreateInput = {
  jobId: string;
  customerName: string;
  phone: string;
  address: string;
  serviceNote: string;
  scheduledAt?: string;
};

export type JobAssignInput = {
  jobId: string;
  staffId: string;
  staffName: string;
};
