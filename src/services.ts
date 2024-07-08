import { Router, Application } from 'express'
import { getBaseURL } from './util.js';
import { PrismaClient } from '@prisma/client/extension';

export default function (app: Application, prisma = new PrismaClient()) {
    
}