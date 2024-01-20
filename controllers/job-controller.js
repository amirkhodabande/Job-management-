const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const index = async (req, res) => {
    const jobs = await Job.find()
        .sort('createdAt');

    res.status(StatusCodes.OK).json(
        {
            jobs,
            total: jobs.length
        }
    );
}

const show = async (req, res) => {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);

    if (!job) {
        throw new NotFoundError(`No job found with id ${jobId}`);
    }

    res.status(StatusCodes.OK).json(
        {
            job
        }
    );
}

const store = async (req, res) => {
    req.body.createdBy = req.user.userId;

    const job = await Job.create(req.body);

    res.status(StatusCodes.CREATED).json({ job });
}

const update = async (req, res) => {
    const {
        body: { company, position },
        user: { userId },
        params: { jobId },
    } = req;

    if(!company || !position) {
        throw new BadRequestError('Company or Body is not provided');
    }

    const job = await Job.findOneAndUpdate(
        {
            _id: jobId,
            createdBy: userId
        },
        {
            company: company,
            position: position
        },
        {
            runValidators: true
        }
    );

    if (!job) {
        throw new NotFoundError(`No job found with id ${jobId}`);
    }

    res.status(StatusCodes.OK).json(
        {
            message: 'Job updated successfully!'
        }
    );
}

const destroy = async (req, res) => {
    const {
        user: { userId },
        params: { jobId },
    } = req;

    const job = await Job.findOneAndDelete({_id: jobId, createdBy: userId});

    if (!job) {
        throw new NotFoundError(`No job found with id ${jobId}`);
    }

    res.status(StatusCodes.OK).json(
        {
            message: 'Job deleted successfully!'
        }
    );
}

module.exports = {
    index, show, store, update, destroy
}