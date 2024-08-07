import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { HonorService } from "../services/honor.service";
import { AchieveHonorDTO } from "src/dtos/achievehonor.dto";
import { MessagePattern, RpcException } from "@nestjs/microservices";
import { LessonResultService } from "src/modules/score-statistics-module/services/lessonresult.service";

@Controller()
export class HonorController {
    constructor(
        private readonly honorService : HonorService,
        private readonly lessonResultService : LessonResultService
    ){}
    
    @MessagePattern('get-user-honor')
    async getUserHonor(data :{userId:string})
    {
        return await this.honorService.getUserHonor(data.userId);
    }

    @MessagePattern('achieve-honor')
    async achieveHonor(data: { honor : AchieveHonorDTO})
    {
        try {
            const response = await this.honorService.achieveHonor(data.honor);
            return response;
          } catch (error) {
            throw new RpcException(error.message);
          }
    }

    @MessagePattern('streak')
    async getStreak(data : {userId : string,courseId : number}){
        return await this.honorService.getStreak(data.userId,data.courseId);
    }

    @MessagePattern('set-goal')
    async setGoal(data : {userId : string , goal : number}){
        return await this.honorService.setGoal(data.userId,data.goal);
    }

    @MessagePattern('get-goal')
    async getGoal(data : {userId : string}){
        return await this.honorService.getGoal(data.userId);
    }

    @MessagePattern('get-daily-score')
    async getDaitlyScore(data : {userId : string}){
        const [response,goal] = await Promise.all([this.lessonResultService.getDailyScore(data.userId),this.honorService.getGoal(data.userId)]);
        return {...response,goal : goal};
    }
}