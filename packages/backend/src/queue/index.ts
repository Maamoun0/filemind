import { Queue, QueueOptions } from 'bullmq';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const queueOptions: QueueOptions = {
    connection: {
        url: REDIS_URL,
    },
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: true, // we don't need to keep job data in Redis, it's tracked in Postgres
        removeOnFail: false,    // keep failed jobs for investigation temporarily
    },
};

export const toolProcessingQueue = new Queue('filemind-processing', queueOptions);

export const addJobToQueue = async (
    jobId: string,
    toolType: string,
    filePath: string,      // Location of the uploaded temporary file
    originalName: string
) => {
    return await toolProcessingQueue.add(
        toolType, // The Tool Type is the job name for specific worker parsing
        {
            jobId,       // UUID from postgres tracking
            toolType,
            filePath,
            originalName,
        },
        { jobId } // unique bullmq id tied to our postgres record
    );
};
