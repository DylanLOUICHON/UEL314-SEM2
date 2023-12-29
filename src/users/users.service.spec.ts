import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

const mockUsersRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'USERS_REPOSITORY',
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });



  /////////////////
  // Test CREATE //
  /////////////////

  describe('create', () => {

    // Créer un utilisateur avec succès
    it('Créer un utilisateur avec succès', async () => {
      const createUserDto = {
        firstname: 'John',
        lastname: 'Doe',
      };

      mockUsersRepository.create.mockReturnValueOnce(createUserDto);

      const result = await service.create(createUserDto);

      expect(result).toEqual(createUserDto);
      expect(mockUsersRepository.create).toHaveBeenCalledWith(createUserDto);
    });

    // Créer un utilisateur avec échec
    it('Créer un utilisateur avec échec', async () => {
      const createUserDto = {} as CreateUserDto;
    
      try {
        await service.create(createUserDto);
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
    it('Retourner les utilisateurs avec succès', async () => {
      const usersArray = [
        { id: 1, firstname: 'John', lastname: 'Doe' },
        { id: 2, firstname: 'Jane', lastname: 'Doe' },
      ];

      mockUsersRepository.findAll.mockReturnValueOnce(usersArray);

      const result = await service.findAll();

      expect(result).toEqual(usersArray);
      expect(mockUsersRepository.findAll).toHaveBeenCalled();
    });

    // Retourner les utilisateurs avec échec
    it('Retourner les utilisateurs avec échec', async () => {
      mockUsersRepository.findAll.mockRejectedValueOnce(new Error('Database connection error'));
    
      try {
        await service.findAll();
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
    it('Retourner un utilisateur avec succès', async () => {
      const userId = 1;
      const user = { id: userId, firstname: 'John', lastname: 'Doe' };

      mockUsersRepository.findByPk.mockReturnValueOnce(user);

      const result = await service.findOne(userId);

      expect(result).toEqual(user);
      expect(mockUsersRepository.findByPk).toHaveBeenCalledWith(userId);
    });

    // Retourner un utilisateur avec échec
    it('Retourner un utilisateur avec échec', async () => {
      const userId = 1;
      mockUsersRepository.findByPk.mockRejectedValueOnce(new Error('Database connection error'));
    
      try {
        await service.findOne(userId);
        fail('Expected to throw an error');
      } catch (error) {
        expect(error.message).toBe('Database connection error');
      }
    });
  });



  /////////////////
  // Test UPDATE //
  /////////////////

  describe('update', () => {

    // Mettre à jour un utilisateur avec succès
    it('Mettre à jour un utilisateur avec succès', async () => {
      const userId = 1;
      const updateUserDto = { firstname: 'Updated', lastname: 'Name' };
      const updatedUser = { id: userId, ...updateUserDto };
    
      mockUsersRepository.update.mockResolvedValue([1, [updatedUser]]);
    
      const result = await service.update(userId, updateUserDto);
    
      expect(result).toEqual([1, [updatedUser]]);
    
      expect(mockUsersRepository.update).toHaveBeenCalledWith(updateUserDto, {
        where: { id: userId },
        returning: true,
      });
    });

    // Mettre à jour un utilisateur avec échec
    it('Mettre à jour un utilisateur avec échec', async () => {
      const userId = 1;
      const updateUserDto = { firstname: 'Updated', lastname: 'Name' };
      mockUsersRepository.update.mockRejectedValueOnce(new Error('Database connection error'));
    
      try {
        await service.update(userId, updateUserDto);
        fail('Expected to throw an error');
      } catch (error) {
        expect(error.message).toBe('Database connection error');
      }
    });
    
  });



  /////////////////
  // Test REMOVE //
  /////////////////

  describe('remove', () => {

    // Supprimer un utilisateur avec succès
    it('Supprimer un utilisateur avec succès', async () => {
      const userId = 1;

      mockUsersRepository.destroy.mockReturnValueOnce(1);

      const result = await service.remove(userId);

      expect(result).toEqual(1);
      expect(mockUsersRepository.destroy).toHaveBeenCalledWith({ where: { id: userId } });
    });

    // Supprimer un utilisateur avec échec
    it('Supprimer un utilisateur avec échec', async () => {
      const userId = 1;
      mockUsersRepository.destroy.mockRejectedValueOnce(new Error('Database connection error'));
    
      try {
        await service.remove(userId);
        fail('Expected to throw an error');
      } catch (error) {
        expect(error.message).toBe('Database connection error');
      }
    });
  });
});
