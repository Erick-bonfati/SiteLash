import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Appointment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: ''
  });

  useEffect(() => {
    fetchServices();
    
    // Se há um serviço selecionado na URL
    const serviceId = searchParams.get('service');
    if (serviceId) {
      setSelectedService(serviceId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedService && selectedDate) {
      fetchAvailableTimes();
    }
  }, [selectedService, selectedDate]);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/products');
      const serviceProducts = response.data.filter(p => p.category === 'serviço');
      setServices(serviceProducts);
    } catch (error) {
      toast.error('Erro ao carregar serviços');
      console.error('Erro ao buscar serviços:', error);
    }
  };

  const fetchAvailableTimes = async () => {
    if (!selectedService || !selectedDate) return;
    
    setLoadingTimes(true);
    try {
      const response = await axios.get(`/api/appointments/available-times/${selectedDate}?serviceId=${selectedService}`);
      setAvailableTimes(response.data.availableTimes);
      setSelectedTime(''); // Reset selected time
    } catch (error) {
      toast.error('Erro ao carregar horários disponíveis');
      console.error('Erro ao buscar horários:', error);
    } finally {
      setLoadingTimes(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error('Por favor, selecione um serviço, data e horário');
      return;
    }

    setLoading(true);
    try {
      const appointmentData = {
        ...formData,
        service: selectedService,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime
      };

      await axios.post('/api/appointments', appointmentData);
      
      toast.success('Agendamento realizado com sucesso! 🎉');
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao realizar agendamento';
      toast.error(message);
      console.error('Erro ao criar agendamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // 30 dias no futuro
    return maxDate.toISOString().split('T')[0];
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const selectedServiceData = services.find(s => s._id === selectedService);

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '600',
              color: '#4a4a4a',
              marginBottom: '1rem'
            }}>
              💅 Agendar Serviço
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Preencha os dados abaixo para agendar seu horário
            </p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit}>
              {/* Seleção de Serviço */}
              <div className="form-group">
                <label className="form-label">Serviço *</label>
                <select
                  className="form-input form-select"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                >
                  <option value="">Selecione um serviço</option>
                  {services.map(service => (
                    <option key={service._id} value={service._id}>
                      {service.name} - {formatPrice(service.price)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Informações do Serviço Selecionado */}
              {selectedServiceData && (
                <div style={{
                  background: '#fdf2f8',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#4a4a4a',
                    marginBottom: '0.5rem'
                  }}>
                    {selectedServiceData.name}
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                    {selectedServiceData.description}
                  </p>
                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      color: '#ec4899'
                    }}>
                      {formatPrice(selectedServiceData.price)}
                    </span>
                    <span style={{
                      color: '#6b7280',
                      fontSize: '0.9rem'
                    }}>
                      ⏱️ {selectedServiceData.duration} minutos
                    </span>
                  </div>
                </div>
              )}

              {/* Seleção de Data */}
              <div className="form-group">
                <label className="form-label">Data *</label>
                <input
                  type="date"
                  className="form-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                  required
                />
              </div>

              {/* Seleção de Horário */}
              {selectedDate && (
                <div className="form-group">
                  <label className="form-label">Horário *</label>
                  {loadingTimes ? (
                    <div className="flex-center" style={{ padding: '2rem' }}>
                      <div className="loading"></div>
                    </div>
                  ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                      gap: '0.5rem'
                    }}>
                      {availableTimes.length === 0 ? (
                        <p style={{ color: '#6b7280', gridColumn: '1 / -1', textAlign: 'center' }}>
                          Nenhum horário disponível para esta data
                        </p>
                      ) : (
                        availableTimes.map(time => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            style={{
                              padding: '0.75rem',
                              border: selectedTime === time ? '2px solid #ec4899' : '2px solid #e5e7eb',
                              borderRadius: '8px',
                              background: selectedTime === time ? '#fdf2f8' : '#ffffff',
                              color: selectedTime === time ? '#ec4899' : '#4a4a4a',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              fontWeight: selectedTime === time ? '600' : '400'
                            }}
                          >
                            {time}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Dados Pessoais */}
              <div style={{
                borderTop: '1px solid #e5e7eb',
                paddingTop: '2rem',
                marginTop: '2rem'
              }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: '#4a4a4a',
                  marginBottom: '1.5rem'
                }}>
                  Seus Dados
                </h3>

                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Nome Completo *</label>
                    <input
                      type="text"
                      name="customerName"
                      className="form-input"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      name="customerEmail"
                      className="form-input"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Telefone *</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    className="form-input"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Observações</label>
                  <textarea
                    name="notes"
                    className="form-input form-textarea"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Alguma observação especial? (opcional)"
                    rows="3"
                  />
                </div>
              </div>

              {/* Botão de Submit */}
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !selectedService || !selectedDate || !selectedTime}
                  style={{
                    fontSize: '1.1rem',
                    padding: '1rem 3rem',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? (
                    <>
                      <div className="loading" style={{ marginRight: '0.5rem' }}></div>
                      Agendando...
                    </>
                  ) : (
                    'Confirmar Agendamento ✨'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
