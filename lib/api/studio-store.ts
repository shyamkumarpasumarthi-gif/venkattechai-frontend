/**
 * Studio Store
 * Zustand store for AI studio state
 */

import { create } from 'zustand';
import type { Job, StudioTool } from '@/types';

interface StudioStore {
  // Tools
  tools: StudioTool[];
  selectedTool: StudioTool | null;
  setTools: (tools: StudioTool[]) => void;
  setSelectedTool: (tool: StudioTool | null) => void;

  // Jobs
  jobs: Job[];
  selectedJob: Job | null;
  jobsLoading: boolean;
  setJobs: (jobs: Job[]) => void;
  setSelectedJob: (job: Job | null) => void;
  setJobsLoading: (loading: boolean) => void;
  addJob: (job: Job) => void;
  updateJob: (job: Job) => void;

  // Upload
  uploadProgress: number;
  isUploading: boolean;
  setUploadProgress: (progress: number) => void;
  setUploading: (uploading: boolean) => void;

  // Parameters
  parameters: Record<string, unknown>;
  setParameters: (params: Record<string, unknown>) => void;
  clearParameters: () => void;
}

export const useStudioStore = create<StudioStore>((set) => ({
  // Tools
  tools: [],
  selectedTool: null,
  setTools: (tools) => set({ tools }),
  setSelectedTool: (tool) => set({ selectedTool: tool }),

  // Jobs
  jobs: [],
  selectedJob: null,
  jobsLoading: false,
  setJobs: (jobs) => set({ jobs }),
  setSelectedJob: (job) => set({ selectedJob: job }),
  setJobsLoading: (loading) => set({ jobsLoading: loading }),
  addJob: (job) =>
    set((state) => ({
      jobs: [job, ...state.jobs],
    })),
  updateJob: (job) =>
    set((state) => ({
      jobs: state.jobs.map((j) => (j.id === job.id ? job : j)),
    })),

  // Upload
  uploadProgress: 0,
  isUploading: false,
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  setUploading: (uploading) => set({ isUploading: uploading }),

  // Parameters
  parameters: {},
  setParameters: (params) => set({ parameters: params }),
  clearParameters: () => set({ parameters: {} }),
}));

export default useStudioStore;
