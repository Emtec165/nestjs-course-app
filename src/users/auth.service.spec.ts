import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("AuthService", () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create fake copy of the users service
    const users: User[] = []
    fakeUsersService = {
      getAll: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 99999), email, password } as User;
        users.push(user)
        return Promise.resolve(user);
      }
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    service = module.get(AuthService);
  });

  it("can create an instance of auth service", async () => {
    expect(service).toBeDefined();
  });

  it("creates a new user with a salted and hashed password", async () => {
    // given
    const samplePassword = "samplePassword";

    // when
    const user = await service.signup("sample@mail.com", samplePassword);

    // then
    expect(user.password).not.toEqual(samplePassword);
    const [salt, hash] = user.password.split(".");
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it("throws an error if user signs up with email that is in use ", async () => {
    // given
    fakeUsersService.getAll = () => Promise.resolve([{ id: 1, email: "sample@email.com" } as User]);

    // when & then
    await expect(service.signup("sample@email.com", "samplePassword")).rejects.toThrow(BadRequestException);
  });

  it("throws is signin is called with unused email ", async () => {
    //given, when & then
    await expect(service.signin("email@email.com", "password")).rejects.toThrow(NotFoundException);
  });

  it("throws if and invalid password is provided", async () => {
    // given
    fakeUsersService.getAll = () => Promise.resolve([{ email: "sample@email.com", password: "samplePassword" } as User]);

    // when & then
    await expect(service.signin("sample@email.com", "anotherPassword")).rejects.toThrow(BadRequestException);
  });

  it("returns a user if correct password is provided", async () => {
    // given
    await service.signup("sample@email.com", "anotherPassword");

    // when
    const user = await service.signin("sample@email.com", "anotherPassword");

    // then
    expect(user).toBeDefined()
  });
});
