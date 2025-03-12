import { Injectable, Logger } from "@nestjs/common";
import { UsersService } from "../users.service";
import { Cron } from "@nestjs/schedule";



@Injectable()
export class CronService {
    private readonly logger = new Logger(CronService.name);
    constructor(private readonly usersService: UsersService) {};
    @Cron('*/10 * * * * *')
    handleCron() {
        this.logger.log('😂Cron Job chạy mỗi 10 giây!');
       
    }
    @Cron('*/10 * * * * *')
    async checkUserBirthdays() {
        const users = await this.usersService.findUsersWithBirthdayToday();
        // console.log("Users having birthday today:", users);
        if (users.length > 0) {
          users.forEach(user => {
            this.logger.log(`Chúc mừng sinh nhật ${user.name}`);
          });
        } else {
          this.logger.log('Không có user nào sinh nhật hôm nay.');
        }
    }
}