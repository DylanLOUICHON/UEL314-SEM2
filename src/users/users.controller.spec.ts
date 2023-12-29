import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Mock du service
const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });



  ///////////////////
  // Test CREATE   //
  ///////////////////

  describe('create', () => {

    // Créer un utilisateur avec succès
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        firstname: 'John',
        lastname: 'Doe',
      };

      mockUsersService.create.mockReturnValueOnce(createUserDto);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(createUserDto);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });

    // Créer un utilisateur avec échec
    it('should fail to create a user with invalid data', async () => {
      const createUserDto = {} as CreateUserDto;
    
      try {
        await controller.create(createUserDto);
        fail('Expected to throw an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });



  ///////////////////
  // Test FIND ALL //
  ///////////////////

  describe('findAll', () => {

    // Retourner les utilisateurs avec succès
    it('should return an array of users successfully', async () => {
      const usersArray = [
        { id: 1, firstname: 'John', lastname: 'Doe' },
        { id: 2, firstname: 'Jane', lastname: 'Doe' },
      ];

      mockUsersService.findAll.mockReturnValueOnce(usersArray);

      const result = await controller.findAll();

      expect(result).toEqual(usersArray);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });

    // Retourner les utilisateurs avec échec
    it('should fail to retrieve users', async () => {
      mockUsersService.findAll.mockRejectedValueOnce(new Error('Database connection error'));
    
      try {
        await controller.findAll();
        fail('Expected to throw an error');
      } catch (error) {
        expect(error.message).toBe('Database connection error');
      }
    });
  });



  ///////////////////
  // Test FIND ONE //
  ///////////////////

  describe('findOne', () => {

    // Retourner un utilisateur avec succès
    it('should return a user by ID successfully', async () => {
      const userId = '1';
      const user = { id: 1, firstname: 'John', lastname: 'Doe' };

      mockUsersService.findOne.mockReturnValueOnce(user);

      const result = await controller.findOne(userId);

      expect(result).toEqual(user);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(+userId);
    });

    // Retourner un utilisateur avec échec
    it('should fail to retrieve a user by ID', async () => {
      const userId = '1';
      mockUsersService.findOne.mockRejectedValueOnce(new Error('Database connection error'));
    
      try {
        await controller.findOne(userId);
        fail('Expected to throw an error');
      } catch (error) {
        expect(error.message).toBe('Database connection error');
      }
    });
  });



  ///////////////////
  // Test UPDATE   //
  ///////////////////

  describe('update', () => {

    // Mettre à jour un utilisateur avec succès
    it('should update a user by ID successfully', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { firstname: 'Updated', lastname: 'Name' };
      const updatedUser = { id: 1, ...updateUserDto };

      mockUsersService.update.mockReturnValueOnce(updatedUser);

      const result = await controller.update(userId, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(mockUsersService.update).toHaveBeenCalledWith(+userId, updateUserDto);
    });

    // Mettre à jour un utilisateur avec échec
    it('should fail to update a user by ID', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { firstname: 'Updated', lastname: 'Name' };
      mockUsersService.update.mockRejectedValueOnce(new Error('Database connection error'));
    
      try {
        await controller.update(userId, updateUserDto);
        // Si la promesse ne rejette pas, le test échoue
        fail('Expected to throw an error');
      } catch (error) {
        expect(error.message).toBe('Database connection error');
      }
    });
  });


  
  ///////////////////
  // Test REMOVE   //
  ///////////////////

  describe('remove', () => {

    // Supprimer un utilisateur avec succès
    it('should remove a user by ID successfully', async () => {
      const userId = '1';

      mockUsersService.remove.mockReturnValueOnce(1);

      const result = await controller.remove(userId);

      expect(result).toEqual(1);
      expect(mockUsersService.remove).toHaveBeenCalledWith(+userId);
    });

    // Supprimer un utilisateur avec échec
    it('should fail to remove a user by ID', async () => {
      const userId = '1';
      mockUsersService.remove.mockRejectedValueOnce(new Error('Database connection error'));
    
      try {
        await controller.remove(userId);
        fail('Expected to throw an error');
      } catch (error) {
        expect(error.message).toBe('Database connection error');
      }
    });
  });
});
