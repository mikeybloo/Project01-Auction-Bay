import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: string): Promise<User | null> {
        return this.usersService.user({ id });
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Query('page') page: number): Promise<User[]> {
        // Pagination using Prisma. Takes the page number minus one and skips as many elements. 
        return this.usersService.users({ 
                skip: page - 1 * 10, // Page 1 = 0 element skips
                take: 10
            });
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUser: User): Promise<User> {
        return this.usersService.createUser(createUser);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() updateUser: User): Promise<User> {
        return this.usersService.updateUser({
            where: { id },
            data: updateUser,
        })
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string): Promise<User> {
        return this.usersService.deleteUser({ id });
    }
}
