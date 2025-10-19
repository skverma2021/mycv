import { Controller, Body, Post, Get, Patch, Param, Query, Delete, NotFoundException, Session, UseGuards } from '@nestjs/common';
import {CurrentUser} from '../users/decorators/current-users-decorator';
import { CreateUserDto } from './dtos/create-users.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(private usersService: UsersService, private authService: AuthService){}

    // @Get('/whoAmI')
    // whoAmI(@Session() session: any){
    //     return this.usersService.findOne(session.userId);
    // }
    @Get('/whoAmI')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User){
        return user;
    }

    @Post('/signOut')
    signOut(@Session() session: any){
        session.userId = null
    }

    
    
    @Get('colors/:color')
    setColor(@Param('color') color: string, @Session() session: any){
        session.color = color;
    }

    @Get('colors')
    getColor(@Session() session: any){
        return session.color;
    }

    @Post('/signUp')
    async createUser(@Body() body: CreateUserDto, @Session() session: any){
        const user = await this.authService.signUp(body.email, body.password)
        session.userId = user.id
        return user
    }

    @Post('/signIn')
    async signInUser(@Body() body:CreateUserDto, @Session() session: any){
        const user = await this.authService.signIn(body.email, body.password)
        session.userId = user.id
        return user
    }


    // @UseInterceptors(new SerializerInterceptor(UserDto))
    @Get('/:id')
    async findUser(@Param('id') id:string ){
        console.log('handler is running')
        const user = await this.usersService.findOne(parseInt(id))
        if (!user){
            throw new NotFoundException('User not found')
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string){
        return this.usersService.find(email)
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string){
        return this.usersService.remove(parseInt(id))
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto){
        return this.usersService.update(parseInt(id), body);
    }

}
