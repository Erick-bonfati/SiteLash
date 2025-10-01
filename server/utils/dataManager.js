const fs = require('fs');
const path = require('path');

class DataManager {
  constructor() {
    this.dataDir = path.join(__dirname, '../data');
    this.productsFile = path.join(this.dataDir, 'products.json');
    this.appointmentsFile = path.join(this.dataDir, 'appointments.json');
    this.adminsFile = path.join(this.dataDir, 'admins.json');
    
    // Criar diretório de dados se não existir
    this.ensureDataDirectory();
  }

  ensureDataDirectory() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  // Carregar dados do JSON
  loadData() {
    const defaultData = {
      admins: [
        {
          _id: '1',
          username: 'admin',
          email: 'admin@sitelash.com',
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // admin123
          role: 'admin',
          isActive: true
        }
      ],
      products: [
        {
          _id: '1',
          name: 'Design de Sobrancelhas',
          description: 'Design personalizado para realçar seus olhos',
          price: 50.00,
          materialCost: 15.00,
          category: 'serviço',
          duration: 30,
          image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=300&fit=crop&crop=face',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: '2',
          name: 'Extensão de Cílios',
          description: 'Cílios mais longos e volumosos',
          price: 120.00,
          materialCost: 35.00,
          category: 'serviço',
          duration: 90,
          image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop&crop=face',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: '3',
          name: 'Kit de Maquiagem',
          description: 'Kit completo com produtos de qualidade',
          price: 89.90,
          materialCost: 45.00,
          category: 'produto',
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      appointments: []
    };

    try {
      const data = {
        admins: this.loadFromFile(this.adminsFile, defaultData.admins),
        products: this.loadFromFile(this.productsFile, defaultData.products),
        appointments: this.loadFromFile(this.appointmentsFile, defaultData.appointments)
      };

      // Converter strings de data de volta para objetos Date
      data.products = data.products.map(product => ({
        ...product,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt)
      }));

      data.appointments = data.appointments.map(appointment => ({
        ...appointment,
        createdAt: new Date(appointment.createdAt),
        updatedAt: new Date(appointment.updatedAt),
        appointmentDate: new Date(appointment.appointmentDate)
      }));

      return data;
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      return defaultData;
    }
  }

  loadFromFile(filePath, defaultValue) {
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(data);
        // Se o arquivo existe mas está vazio ou é inválido, retornar dados padrão
        if (!parsed || (Array.isArray(parsed) && parsed.length === 0)) {
          console.log(`Arquivo ${filePath} está vazio, usando dados padrão`);
          return defaultValue;
        }
        return parsed;
      }
    } catch (error) {
      console.error(`Erro ao carregar arquivo ${filePath}:`, error);
    }
    return defaultValue;
  }

  // Salvar produtos
  saveProducts(products) {
    try {
      fs.writeFileSync(this.productsFile, JSON.stringify(products, null, 2));
      return true;
    } catch (error) {
      console.error('Erro ao salvar produtos:', error);
      return false;
    }
  }

  // Salvar agendamentos
  saveAppointments(appointments) {
    try {
      fs.writeFileSync(this.appointmentsFile, JSON.stringify(appointments, null, 2));
      return true;
    } catch (error) {
      console.error('Erro ao salvar agendamentos:', error);
      return false;
    }
  }

  // Salvar administradores
  saveAdmins(admins) {
    try {
      fs.writeFileSync(this.adminsFile, JSON.stringify(admins, null, 2));
      return true;
    } catch (error) {
      console.error('Erro ao salvar administradores:', error);
      return false;
    }
  }

  // Gerar novo ID
  generateId(items) {
    if (items.length === 0) return '1';
    const maxId = Math.max(...items.map(item => parseInt(item._id) || 0));
    return (maxId + 1).toString();
  }
}

module.exports = new DataManager();
