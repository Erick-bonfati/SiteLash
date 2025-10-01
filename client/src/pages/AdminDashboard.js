import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ImageUpload from '../components/ImageUpload';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [products, setProducts] = useState([]);
  const [financialMetrics, setFinancialMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    materialCost: '',
    category: 'serviço',
    duration: '',
    image: ''
  });

  useEffect(() => {
    if (activeTab === 'appointments') {
      fetchAppointments();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'financial') {
      fetchFinancialMetrics();
    }
  }, [activeTab]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/appointments');
      setAppointments(response.data);
    } catch (error) {
      toast.error('Erro ao carregar agendamentos');
      console.error('Erro ao buscar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/products/all');
      setProducts(response.data);
    } catch (error) {
      toast.error('Erro ao carregar produtos');
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFinancialMetrics = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/financial/metrics');
      setFinancialMetrics(response.data);
    } catch (error) {
      toast.error('Erro ao carregar métricas financeiras');
      console.error('Erro ao buscar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        duration: productForm.category === 'serviço' ? parseInt(productForm.duration) : undefined
      };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, productData);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await axios.post('/api/products', productData);
        toast.success('Produto criado com sucesso!');
      }

      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        materialCost: '',
        category: 'serviço',
        duration: '',
        image: ''
      });
      fetchProducts();
    } catch (error) {
      toast.error('Erro ao salvar produto');
      console.error('Erro ao salvar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      materialCost: product.materialCost ? product.materialCost.toString() : '',
      category: product.category,
      duration: product.duration ? product.duration.toString() : '',
      image: product.image || ''
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Tem certeza que deseja deletar este produto?')) {
      return;
    }

    try {
      await axios.delete(`/api/products/${productId}`);
      toast.success('Produto deletado com sucesso!');
      fetchProducts();
    } catch (error) {
      toast.error('Erro ao deletar produto');
      console.error('Erro ao deletar produto:', error);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      await axios.put(`/api/appointments/${appointmentId}/status`, { status });
      toast.success('Status atualizado com sucesso!');
      fetchAppointments();
    } catch (error) {
      toast.error('Erro ao atualizar status');
      console.error('Erro ao atualizar status:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatTime = (time) => {
    return time;
  };

  const getStatusColor = (status) => {
    const colors = {
      pendente: '#f59e0b',
      confirmado: '#10b981',
      cancelado: '#ef4444',
      concluído: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '600',
              color: '#4a4a4a',
              marginBottom: '1rem'
            }}>
              🎛️ Painel Administrativo
            </h1>
            <p style={{
              color: '#6b7280',
              fontSize: '1.1rem'
            }}>
              Gerencie produtos, serviços e agendamentos
            </p>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            borderBottom: '2px solid #e5e7eb'
          }}>
            <button
              onClick={() => setActiveTab('appointments')}
              style={{
                padding: '1rem 2rem',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'appointments' ? '3px solid #ec4899' : '3px solid transparent',
                color: activeTab === 'appointments' ? '#ec4899' : '#6b7280',
                fontWeight: activeTab === 'appointments' ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              📅 Agendamentos
            </button>
            <button
              onClick={() => setActiveTab('products')}
              style={{
                padding: '1rem 2rem',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'products' ? '3px solid #ec4899' : '3px solid transparent',
                color: activeTab === 'products' ? '#ec4899' : '#6b7280',
                fontWeight: activeTab === 'products' ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🛍️ Produtos/Serviços
            </button>
            <button
              onClick={() => setActiveTab('financial')}
              style={{
                padding: '1rem 2rem',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'financial' ? '3px solid #ec4899' : '3px solid transparent',
                color: activeTab === 'financial' ? '#ec4899' : '#6b7280',
                fontWeight: activeTab === 'financial' ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              💰 Financeiro
            </button>
          </div>

          {/* Conteúdo das Tabs */}
          {activeTab === 'appointments' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#4a4a4a'
                }}>
                  Agendamentos ({appointments.length})
                </h2>
                <button
                  onClick={fetchAppointments}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  {loading ? 'Carregando...' : 'Atualizar'}
                </button>
              </div>

              {loading ? (
                <div className="flex-center" style={{ padding: '3rem' }}>
                  <div className="loading"></div>
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center" style={{ padding: '3rem' }}>
                  <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                    Nenhum agendamento encontrado.
                  </p>
                </div>
              ) : (
                <div className="grid grid-1" style={{ gap: '1rem' }}>
                  {appointments.map(appointment => (
                    <div key={appointment._id} className="card">
                      <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            color: '#4a4a4a',
                            marginBottom: '0.5rem'
                          }}>
                            {appointment.customerName}
                          </h3>
                          <p style={{ color: '#6b7280', margin: 0 }}>
                            {appointment.service?.name} - {formatPrice(appointment.totalPrice)}
                          </p>
                        </div>
                        <div style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          background: `${getStatusColor(appointment.status)}20`,
                          color: getStatusColor(appointment.status),
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {appointment.status}
                        </div>
                      </div>

                      <div className="grid grid-3" style={{ marginBottom: '1rem' }}>
                        <div>
                          <strong style={{ color: '#4a4a4a' }}>📧 Email:</strong>
                          <p style={{ color: '#6b7280', margin: 0 }}>{appointment.customerEmail}</p>
                        </div>
                        <div>
                          <strong style={{ color: '#4a4a4a' }}>📞 Telefone:</strong>
                          <p style={{ color: '#6b7280', margin: 0 }}>{appointment.customerPhone}</p>
                        </div>
                        <div>
                          <strong style={{ color: '#4a4a4a' }}>📅 Data/Hora:</strong>
                          <p style={{ color: '#6b7280', margin: 0 }}>
                            {formatDate(appointment.appointmentDate)} às {formatTime(appointment.appointmentTime)}
                          </p>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div style={{ marginBottom: '1rem' }}>
                          <strong style={{ color: '#4a4a4a' }}>📝 Observações:</strong>
                          <p style={{ color: '#6b7280', margin: 0 }}>{appointment.notes}</p>
                        </div>
                      )}

                      <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                      }}>
                        {['pendente', 'confirmado', 'cancelado', 'concluído'].map(status => (
                          <button
                            key={status}
                            onClick={() => updateAppointmentStatus(appointment._id, status)}
                            style={{
                              padding: '0.5rem 1rem',
                              border: '1px solid #e5e7eb',
                              borderRadius: '15px',
                              background: appointment.status === status ? getStatusColor(status) : '#ffffff',
                              color: appointment.status === status ? '#ffffff' : getStatusColor(status),
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              textTransform: 'capitalize',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#4a4a4a'
                }}>
                  Produtos/Serviços ({products.length})
                </h2>
                <button
                  onClick={() => {
                    setShowProductForm(true);
                    setEditingProduct(null);
                    setProductForm({
                      name: '',
                      description: '',
                      price: '',
                      materialCost: '',
                      category: 'serviço',
                      duration: '',
                      image: ''
                    });
                  }}
                  className="btn btn-primary"
                >
                  ➕ Novo Produto
                </button>
              </div>

              {/* Formulário de Produto */}
              {showProductForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    color: '#4a4a4a',
                    marginBottom: '1.5rem'
                  }}>
                    {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                  </h3>

                  <form onSubmit={handleProductSubmit}>
                    <div className="grid grid-2">
                      <div className="form-group">
                        <label className="form-label">Nome *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={productForm.name}
                          onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Categoria *</label>
                        <select
                          className="form-input form-select"
                          value={productForm.category}
                          onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                          required
                        >
                          <option value="serviço">Serviço</option>
                          <option value="produto">Produto</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Descrição *</label>
                      <textarea
                        className="form-input form-textarea"
                        value={productForm.description}
                        onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                        required
                        rows="3"
                      />
                    </div>

                    <div className="grid grid-2">
                      <div className="form-group">
                        <label className="form-label">Preço (R$) *</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="form-input"
                          value={productForm.price}
                          onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Custo de Material (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="form-input"
                          value={productForm.materialCost}
                          onChange={(e) => setProductForm(prev => ({ ...prev, materialCost: e.target.value }))}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    {productForm.category === 'serviço' && (
                      <div className="form-group">
                        <label className="form-label">Duração (minutos) *</label>
                        <input
                          type="number"
                          min="15"
                          step="15"
                          className="form-input"
                          value={productForm.duration}
                          onChange={(e) => setProductForm(prev => ({ ...prev, duration: e.target.value }))}
                          required
                        />
                      </div>
                    )}

                    <ImageUpload
                      onImageUpload={(imageUrl) => setProductForm(prev => ({ ...prev, image: imageUrl }))}
                      currentImage={productForm.image}
                      disabled={loading}
                    />

                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      justifyContent: 'flex-end'
                    }}>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProductForm(false);
                          setEditingProduct(null);
                        }}
                        className="btn btn-secondary"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? 'Salvando...' : (editingProduct ? 'Atualizar' : 'Criar')}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {loading ? (
                <div className="flex-center" style={{ padding: '3rem' }}>
                  <div className="loading"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center" style={{ padding: '3rem' }}>
                  <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                    Nenhum produto encontrado.
                  </p>
                </div>
              ) : (
                <div className="grid grid-3">
                  {products.map(product => (
                    <div key={product._id} className="card">
                      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{
                              width: '80px',
                              height: '80px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              margin: '0 auto 1rem',
                              boxShadow: '0 4px 15px rgba(248, 181, 193, 0.2)'
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '60px',
                            height: '60px',
                            background: 'linear-gradient(135deg, #f8b5c1, #fce7f3)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem',
                            fontSize: '1.5rem'
                          }}>
                            {product.category === 'serviço' ? '💅' : '🛍️'}
                          </div>
                        )}
                        <h3 style={{
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          color: '#4a4a4a',
                          marginBottom: '0.5rem'
                        }}>
                          {product.name}
                        </h3>
                        <p style={{
                          color: '#6b7280',
                          fontSize: '0.9rem',
                          marginBottom: '1rem'
                        }}>
                          {product.description}
                        </p>
                      </div>

                      <div style={{
                        background: '#fdf2f8',
                        padding: '1rem',
                        borderRadius: '10px',
                        marginBottom: '1rem'
                      }}>
                        <div style={{
                          fontSize: '1.2rem',
                          fontWeight: '700',
                          color: '#ec4899',
                          textAlign: 'center'
                        }}>
                          {formatPrice(product.price)}
                        </div>
                        {product.category === 'serviço' && product.duration && (
                          <div style={{
                            fontSize: '0.8rem',
                            color: '#6b7280',
                            textAlign: 'center',
                            marginTop: '0.25rem'
                          }}>
                            ⏱️ {product.duration} min
                          </div>
                        )}
                      </div>

                      <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        justifyContent: 'center'
                      }}>
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="btn btn-outline"
                          style={{ 
                            fontSize: '0.8rem', 
                            padding: '0.5rem 1rem',
                            color: '#ef4444',
                            borderColor: '#ef4444'
                          }}
                        >
                          🗑️ Deletar
                        </button>
                      </div>

                      <div style={{
                        marginTop: '0.5rem',
                        textAlign: 'center'
                      }}>
                        <span style={{
                          fontSize: '0.7rem',
                          color: product.isActive ? '#10b981' : '#ef4444',
                          background: product.isActive ? '#10b98120' : '#ef444420',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '10px',
                          textTransform: 'uppercase',
                          fontWeight: '500'
                        }}>
                          {product.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Seção Financeira */}
          {activeTab === 'financial' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#4a4a4a'
                }}>
                  💰 Métricas Financeiras
                </h2>
                <button
                  onClick={fetchFinancialMetrics}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  {loading ? 'Carregando...' : 'Atualizar'}
                </button>
              </div>

              {loading ? (
                <div className="flex-center" style={{ padding: '3rem' }}>
                  <div className="loading"></div>
                </div>
              ) : financialMetrics ? (
                <div>
                  {/* Cards de Métricas */}
                  <div className="grid grid-3" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#4a4a4a', marginBottom: '0.5rem' }}>
                        Faturamento Bruto
                      </h3>
                      <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
                        {formatPrice(financialMetrics.grossRevenue)}
                      </p>
                      <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                        Agendamentos confirmados + concluídos
                      </p>
                    </div>

                    <div className="card" style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💵</div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#4a4a4a', marginBottom: '0.5rem' }}>
                        Faturamento Líquido
                      </h3>
                      <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6' }}>
                        {formatPrice(financialMetrics.netRevenue)}
                      </p>
                      <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                        Agendamentos concluídos - custos
                      </p>
                    </div>

                    <div className="card" style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#4a4a4a', marginBottom: '0.5rem' }}>
                        Custo de Materiais
                      </h3>
                      <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>
                        {formatPrice(financialMetrics.materialCost)}
                      </p>
                      <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                        Total gasto em materiais
                      </p>
                    </div>
                  </div>

                  {/* Estatísticas de Agendamentos */}
                  <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#4a4a4a', marginBottom: '1.5rem' }}>
                      📊 Estatísticas de Agendamentos
                    </h3>
                    <div className="grid grid-4" style={{ gap: '1rem' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#6b7280' }}>
                          {financialMetrics.totalAppointments}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Total</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>
                          {financialMetrics.pendingAppointments}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Pendentes</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>
                          {financialMetrics.confirmedAppointments}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Confirmados</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6' }}>
                          {financialMetrics.completedAppointments}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Concluídos</div>
                      </div>
                    </div>
                  </div>

                  {/* Margem de Lucro */}
                  <div className="card">
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#4a4a4a', marginBottom: '1rem' }}>
                      📈 Margem de Lucro
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>
                        {financialMetrics.profitMargin}%
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          background: '#e5e7eb',
                          height: '10px',
                          borderRadius: '5px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            background: '#10b981',
                            height: '100%',
                            width: `${Math.min(financialMetrics.profitMargin, 100)}%`,
                            transition: 'width 0.3s ease'
                          }}></div>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.5rem' }}>
                      Percentual de lucro sobre o faturamento bruto
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center" style={{ padding: '3rem' }}>
                  <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                    Erro ao carregar métricas financeiras.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
