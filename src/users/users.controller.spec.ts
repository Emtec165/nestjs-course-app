import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";

describe("UsersController", () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeAuthService = {
      signup: (email: string, password: string) => {
        return Promise.resolve({} as User);
      },
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      }
    };

    fakeUsersService = {
      get: (id: number) => {
        return Promise.resolve({ id, email: "sample@email.com", password: "password" } as User);
      },
      getAll: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: "password" } as User]);
      },
      update: (id: number, attrs: Partial<User>) => {
        return Promise.resolve({} as User);
      },
      remove: (id: number) => {
        return Promise.resolve({} as User);
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService
        },
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("findAll users returns a list of users with the given email", async () => {

    // given & when
    const users = await controller.findAll("sample@email.com");

    // then
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual("sample@email.com");
  });

  it("find returns single user with a given id", async () => {

    // given & when
    const user = await controller.find(1);

    // then
    expect(user).toBeDefined();
  });

  it("signin updated session object and returns user", async () => {

    // given
    const session = {userId: -10}
    const userDto = { email: "sample@email.com", password: "pass" };

    // when
    const user = await controller.signin(userDto, session);

    // then
    expect(user).toBeDefined()
    expect(user.id).toEqual(1)
    expect(session.userId).toEqual(1)
  });
});
