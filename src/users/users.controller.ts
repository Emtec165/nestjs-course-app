import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Session,
  UseGuards
} from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { Serialize } from "../incerceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { User } from "./user.entity";
import { AuthGuard } from "../guards/auth.guard";

@Serialize(UserDto) // <- can be used on whole controller
@Controller("auth")
// @UseInterceptors(CurrentUserInterceptor) // <- can be controller scoped
export class UsersController {

  constructor(private authService: AuthService, private usersService: UsersService) {
  }

  @Post("signup")
  async create(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id
    return user
  }

  @Post('signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id
    return user
  }

  @Post('signout')
  signout(@Session() session: any) {
    session.userId = null
  }

  @UseGuards(AuthGuard)
  @Get('whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  // @Serialize(UserDto) // <- can be used on route handler
  @Get("one/:id")
  find(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.get(id);
  }

  @Get("all")
  findAll(@Query("email") email: string) {
    return this.usersService.getAll(email);
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }



  //cookie manipulation demo
  @Get('color/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color
  }

  @Get('color')
  getColor(@Session() session: any) {
    return session.color
  }
}
