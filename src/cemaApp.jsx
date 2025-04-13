import React, { useState, useEffect } from 'react';
import { Bell, Search, Settings, Database, FileText, User, LogOut } from 'lucide-react';
import Logo from '../src/cemaLogo.jpg';

// Mock data for demonstration
const mockBoletos = [
  { id: 1, cliente: "Maria Silva", cpf: "123.456.789-00", seguro: "Porto Seguro", valor: "R$ 245,90", vencimento: "15/04/2025", status: "Pendente" },
  { id: 2, cliente: "João Pereira", cpf: "987.654.321-00", seguro: "Tokio Marine", valor: "R$ 178,50", vencimento: "20/04/2025", status: "Pendente" },
  { id: 3, cliente: "Ana Souza", cpf: "456.789.123-00", seguro: "Bradesco", valor: "R$ 320,75", vencimento: "12/04/2025", status: "Atrasado" },
  { id: 4, cliente: "Carlos Santos", cpf: "789.123.456-00", seguro: "Allianz", valor: "R$ 412,30", vencimento: "28/04/2025", status: "Pendente" },
  { id: 5, cliente: "Lucia Ferreira", cpf: "321.654.987-00", seguro: "Porto Seguro", valor: "R$ 195,80", vencimento: "05/05/2025", status: "Pendente" }
];

const urls = [
  { id: 1, nome: "Porto Seguro", url: "https://www.portoseguro.com.br/seguros" },
  { id: 2, nome: "Bradesco Seguros", url: "https://www.bradescoseguros.com.br" },
  { id: 3, nome: "SulAmérica", url: "https://www.sulamerica.com.br" }
];

export default function CemaBoletosMVP() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState('splash');
  const [boletos, setBoletos] = useState(mockBoletos);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedBoleto, setSelectedBoleto] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showNotification, setShowNotification] = useState(false);
  const [sourceUrls, setSourceUrls] = useState(urls);
  const [newUrl, setNewUrl] = useState({ nome: '', url: '' });
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [statusFilter, setStatusFilter] = useState('');
  const [addBoletoForm, setAddBoletoForm] = useState({
    cliente: '',
    cpf: '',
    seguro: 'Auto',
    valor: '',
    vencimento: '',
    status: 'Pendente'
  });
  const [showAddBoletoModal, setShowAddBoletoModal] = useState(false);

  // Login effect
  useEffect(() => {
    if (page === 'splash') {
      setTimeout(() => setPage('login'), 2000);
    }
  }, [page]);

  // Notification effect
  useEffect(() => {
    if (page === 'dashboard' && !showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [page, showNotification]);

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      setCurrentUser({ name: 'Iara Francisco de Moura', role: 'Gerente de Boletos' });
      setPage('dashboard');
    } else {
      displayModal('Erro de Login', 'Por favor, preencha todos os campos.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setPage('login');
    setMenuOpen(false);
  };

  // Filter boletos based on search and status filter
  const filteredBoletos = boletos.filter(boleto => {
    const matchesSearch = boleto.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         boleto.cpf.includes(searchTerm);
    const matchesStatus = statusFilter ? boleto.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Add new URL
  const handleAddUrl = () => {
    if (newUrl.nome && newUrl.url) {
      setSourceUrls([...sourceUrls, {...newUrl, id: sourceUrls.length + 1}]);
      setNewUrl({ nome: '', url: '' });
      displayModal('Sucesso', 'URL da seguradora adicionada com sucesso!');
    } else {
      displayModal('Erro', 'Por favor, preencha todos os campos.');
    }
  };

  // Display modal
  const displayModal = (title, message) => {
    setModalContent({ title, message });
    setShowModal(true);
  };

  // Send notification
  const sendNotification = (boleto) => {
    displayModal('Notificação Enviada', `Notificação enviada para ${boleto.cliente} sobre boleto com vencimento em ${boleto.vencimento}.`);
  };

  // Extract boletos
  const extractBoletos = () => {
    displayModal('Extração Iniciada', 'Iniciando extração de boletos das URLs configuradas. Este processo pode levar alguns minutos.');
    setTimeout(() => {
      const newBoleto = {
        id: boletos.length + 1,
        cliente: "Roberto Almeida",
        cpf: "111.222.333-44",
        seguro: "Vida",
        valor: "R$ 289,50",
        vencimento: "18/04/2025",
        status: "Pendente"
      };
      setBoletos([...boletos, newBoleto]);
      displayModal('Extração Concluída', 'Boletos extraídos com sucesso! Novos boletos foram adicionados ao sistema.');
    }, 3000);
  };

  // Remove URL
  const removeUrl = (id) => {
    setSourceUrls(sourceUrls.filter(url => url.id !== id));
    displayModal('Sucesso', 'URL da seguradora removida com sucesso!');
  };

  // Mark boleto as paid
  const markAsPaid = (id) => {
    const updatedBoletos = boletos.map(boleto => 
      boleto.id === id ? {...boleto, status: 'Pago'} : boleto
    );
    setBoletos(updatedBoletos);
    setSelectedBoleto(null);
    displayModal('Sucesso', 'Boleto marcado como pago com sucesso!');
  };

  // Handle adding new boleto
  const handleAddBoleto = () => {
    if (addBoletoForm.cliente && addBoletoForm.cpf && addBoletoForm.valor && addBoletoForm.vencimento) {
      const newBoleto = {
        id: boletos.length + 1,
        ...addBoletoForm
      };
      setBoletos([...boletos, newBoleto]);
      setAddBoletoForm({
        cliente: '',
        cpf: '',
        seguro: 'Auto',
        valor: '',
        vencimento: '',
        status: 'Pendente'
      });
      setShowAddBoletoModal(false);
      displayModal('Sucesso', 'Boleto adicionado com sucesso!');
    } else {
      displayModal('Erro', 'Por favor, preencha todos os campos obrigatórios.');
    }
  };

  // Components
  const Splash = () => (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-primary text-white">
      <img src={Logo} alt="Cema Aliança Logo" className="mb-4" />
      <h1 className="display-4 fw-bold mb-3">Cema Aliança</h1>
      <p className="lead">Sistema de Gestão de Boletos</p>
    </div>
  );

  const Login = () => (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="card shadow">
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <img src={Logo} alt="Cema Aliança Logo" className="mb-3 w-50" />
              <h2 className="h4 fw-bold">Login - Sistema de Boletos</h2>
            </div>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email-address" className="visually-hidden">Email</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="form-control"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="visually-hidden">Senha</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="form-control"
                  placeholder="Senha"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const Navbar = () => (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div className="container-fluid">
        <span className="navbar-brand">Cema Aliança</span>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button className="nav-link" onClick={() => setPage('dashboard')}>
                Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={() => setPage('boletos')}>
                Boletos
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={() => setPage('config')}>
                Configurações
              </button>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            {showSearch ? (
              <div className="input-group me-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar cliente ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                <button
                  className="btn btn-outline-light"
                  onClick={() => setShowSearch(false)}
                >
                  ×
                </button>
              </div>
            ) : (
              <button className="btn btn-link text-white me-3" onClick={() => setShowSearch(true)}>
                <Search size={20} />
              </button>
            )}
            <div className="dropdown">
              <button
                className="btn btn-link text-white dropdown-toggle"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <User size={20} className="me-1" /> {currentUser?.name}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <LogOut size={16} className="me-2" /> Sair
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  const Dashboard = () => (
    <div className="container py-4">
      <h1 className="h2 fw-bold mb-4">Dashboard - Visão Geral</h1>

      <div className="row row-cols-1 row-cols-md-3 g-4 mb-4">
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 fw-semibold mb-2">Boletos a Vencer</h2>
              <p className="display-6 fw-bold text-primary">{boletos.filter(b => b.status === 'Pendente').length}</p>
              <p className="text-muted small mt-2">Próximos 7 dias</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 fw-semibold mb-2">Boletos Atrasados</h2>
              <p className="display-6 fw-bold text-danger">{boletos.filter(b => b.status === 'Atrasado').length}</p>
              <p className="text-muted small mt-2">Atenção necessária</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 fw-semibold mb-2">Total de Boletos</h2>
              <p className="display-6 fw-bold text-secondary">{boletos.length}</p>
              <p className="text-muted small mt-2">No sistema</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 fw-semibold">Boletos Próximos ao Vencimento</h2>
            <button
              onClick={() => setPage('boletos')}
              className="btn btn-link text-primary"
            >
              Ver todos
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col">Cliente</th>
                  <th scope="col">Seguro</th>
                  <th scope="col">Valor</th>
                  <th scope="col">Vencimento</th>
                  <th scope="col">Status</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {boletos.filter(b => b.vencimento <= "30/04/2025").map(boleto => (
                  <tr key={boleto.id}>
                    <td>{boleto.cliente}</td>
                    <td>{boleto.seguro}</td>
                    <td>{boleto.valor}</td>
                    <td>{boleto.vencimento}</td>
                    <td>
                      <span className={`badge ${
                        boleto.status === 'Pendente' ? 'bg-warning text-dark' :
                        boleto.status === 'Atrasado' ? 'bg-danger' :
                        'bg-success'
                      }`}>
                        {boleto.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => sendNotification(boleto)}
                        className="btn btn-link text-primary"
                      >
                        Notificar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="h5 fw-semibold mb-3">Ações Rápidas</h2>
          <div className="row row-cols-1 row-cols-md-3 g-3">
            <div className="col">
              <button
                onClick={extractBoletos}
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
              >
                <Database size={20} className="me-2" /> Extrair Boletos
              </button>
            </div>
            <div className="col">
              <button
                onClick={() => setShowAddBoletoModal(true)}
                className="btn btn-success w-100 d-flex align-items-center justify-content-center"
              >
                <FileText size={20} className="me-2" /> Adicionar Boleto
              </button>
            </div>
            <div className="col">
              <button
                onClick={() => setPage('config')}
                className="btn btn-secondary w-100 d-flex align-items-center justify-content-center"
              >
                <Settings size={20} className="me-2" /> Configurações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const BoletosPage = () => (
    <div className="container py-4">
      <h1 className="h2 fw-bold mb-4">Gerenciamento de Boletos</h1>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 fw-semibold">Filtros</h2>
            <button
              onClick={() => setShowAddBoletoModal(true)}
              className="btn btn-success d-flex align-items-center"
            >
              <FileText size={16} className="me-2" /> Adicionar Boleto
            </button>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar cliente ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos os Status</option>
                <option value="Pendente">Pendente</option>
                <option value="Atrasado">Atrasado</option>
                <option value="Pago">Pago</option>
              </select>
            </div>
            <div className="col-md-4">
              <button
                onClick={extractBoletos}
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
              >
                <Database size={16} className="me-2" /> Extrair Novos Boletos
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col">Cliente</th>
                  <th scope="col">CPF</th>
                  <th scope="col">Seguro</th>
                  <th scope="col">Valor</th>
                  <th scope="col">Vencimento</th>
                  <th scope="col">Status</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredBoletos.length > 0 ? (
                  filteredBoletos.map(boleto => (
                    <tr key={boleto.id}>
                      <td>{boleto.cliente}</td>
                      <td>{boleto.cpf}</td>
                      <td>{boleto.seguro}</td>
                      <td>{boleto.valor}</td>
                      <td>{boleto.vencimento}</td>
                      <td>
                        <span className={`badge ${
                          boleto.status === 'Pendente' ? 'bg-warning text-dark' :
                          boleto.status === 'Atrasado' ? 'bg-danger' :
                          'bg-success'
                        }`}>
                          {boleto.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedBoleto(boleto)}
                          className="btn btn-link text-primary me-2"
                        >
                          Visualizar
                        </button>
                        {boleto.status !== 'Pago' && (
                          <button
                            onClick={() => sendNotification(boleto)}
                            className="btn btn-link text-success"
                          >
                            Notificar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      Nenhum boleto encontrado. Ajuste os filtros ou adicione novos boletos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedBoleto && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalhes do Boleto</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedBoleto(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <p className="text-muted small">Cliente</p>
                  <p className="fw-medium">{selectedBoleto.cliente}</p>
                </div>
                <div className="mb-3">
                  <p className="text-muted small">CPF</p>
                  <p className="fw-medium">{selectedBoleto.cpf}</p>
                </div>
                <div className="mb-3">
                  <p className="text-muted small">Seguro</p>
                  <p className="fw-medium">{selectedBoleto.seguro}</p>
                </div>
                <div className="mb-3">
                  <p className="text-muted small">Valor</p>
                  <p className="fw-medium">{selectedBoleto.valor}</p>
                </div>
                <div className="mb-3">
                  <p className="text-muted small">Vencimento</p>
                  <p className="fw-medium">{selectedBoleto.vencimento}</p>
                </div>
                <div className="mb-3">
                  <p className="text-muted small">Status</p>
                  <span className={`badge ${
                    selectedBoleto.status === 'Pendente' ? 'bg-warning text-dark' :
                    selectedBoleto.status === 'Atrasado' ? 'bg-danger' :
                    'bg-success'
                  }`}>
                    {selectedBoleto.status}
                  </span>
                </div>
              </div>
              <div className="modal-footer">
                {selectedBoleto.status !== 'Pago' && (
                  <>
                    <button
                      onClick={() => {
                        sendNotification(selectedBoleto);
                        setSelectedBoleto(null);
                      }}
                      className="btn btn-primary"
                    >
                      Enviar Notificação
                    </button>
                    <button
                      onClick={() => markAsPaid(selectedBoleto.id)}
                      className="btn btn-success"
                    >
                      Marcar como Pago
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedBoleto(null)}
                  className="btn btn-secondary"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const ConfigPage = () => (
    <div className="container py-4">
      <h1 className="h2 fw-bold mb-4">Configurações</h1>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h5 fw-semibold mb-3">URLs das Seguradoras</h2>
          <p className="text-muted small mb-3">Configure as URLs das seguradoras para extração automática de boletos.</p>

          <div className="table-responsive mb-4">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">URL</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sourceUrls.map(url => (
                  <tr key={url.id}>
                    <td>{url.nome}</td>
                    <td>{url.url}</td>
                    <td>
                      <button
                        onClick={() => removeUrl(url.id)}
                        className="btn btn-link text-danger"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-top pt-3">
            <h3 className="h6 fw-medium mb-2">Adicionar Nova URL</h3>
            <div className="row g-3">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nome da Seguradora"
                  value={newUrl.nome}
                  onChange={(e) => setNewUrl({...newUrl, nome: e.target.value})}
                />
              </div>
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="URL (https://...)"
                  value={newUrl.url}
                  onChange={(e) => setNewUrl({...newUrl, url: e.target.value})}
                />
              </div>
              <div className="col-md-2">
                <button
                  onClick={handleAddUrl}
                  className="btn btn-primary w-100"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="h5 fw-semibold mb-3">Configurações de Notificação</h2>
          <p className="text-muted small mb-3">Configure como as notificações automáticas são enviadas aos clientes.</p>

          <div className="mb-3">
            <label className="form-label">Enviar notificações automáticas</label>
            <div className="form-check">
              <input
                id="auto-notify"
                type="checkbox"
                className="form-check-input"
                defaultChecked
              />
              <label htmlFor="auto-notify" className="form-check-label">
                Notificar clientes automaticamente antes do vencimento
              </label>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Dias antes do vencimento para enviar notificação</label>
            <select className="form-select">
              <option value="1">1 dia antes</option>
              <option value="3" selected>3 dias antes</option>
              <option value="5">5 dias antes</option>
              <option value="7">7 dias antes</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Método de notificação preferencial</label>
            <select className="form-select">
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="both" selected>Ambos (Email e SMS)</option>
            </select>
          </div>

          <div className="d-flex justify-content-end">
            <button
              onClick={() => displayModal('Sucesso', 'Configurações salvas com sucesso!')}
              className="btn btn-primary"
            >
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const Modal = () => (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{modalContent.title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <p>{modalContent.message}</p>
          </div>
          <div className="modal-footer">
            <button
              onClick={() => setShowModal(false)}
              className="btn btn-primary"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const Notification = () => (
    <div className="position-fixed bottom-0 end-0 m-3 bg-white rounded shadow p-3" style={{ maxWidth: '300px', zIndex: 1050 }}>
      <div className="d-flex align-items-start">
        <Bell size={20} className="text-primary me-2" />
        <div>
          <h3 className="h6 fw-medium">Lembrete de Boletos</h3>
          <p className="small text-muted">Existem 3 boletos com vencimento nos próximos 7 dias.</p>
        </div>
        <button
          onClick={() => setShowNotification(false)}
          className="btn-close ms-auto"
        ></button>
      </div>
    </div>
  );

  const AddBoletoModal = () => (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Adicionar Novo Boleto</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowAddBoletoModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Cliente</label>
              <input
                type="text"
                className="form-control"
                value={addBoletoForm.cliente}
                onChange={(e) => setAddBoletoForm({...addBoletoForm, cliente: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">CPF</label>
              <input
                type="text"
                className="form-control"
                value={addBoletoForm.cpf}
                onChange={(e) => setAddBoletoForm({...addBoletoForm, cpf: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Tipo de Seguro</label>
              <select
                className="form-select"
                value={addBoletoForm.seguro}
                onChange={(e) => setAddBoletoForm({...addBoletoForm, seguro: e.target.value})}
              >
                <option value="Porto Seguro">Porto Seguro</option>
                <option value="Bradesco">Bradesco</option>
                <option value="Allianz">Allianz</option>
                <option value="Tokio Marine">Tokio Marine</option>
                <option value="Mapfre">Mapfre</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Valor</label>
              <input
                type="text"
                className="form-control"
                placeholder="R$ 0,00"
                value={addBoletoForm.valor}
                onChange={(e) => setAddBoletoForm({...addBoletoForm, valor: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Data de Vencimento</label>
              <input
                type="text"
                className="form-control"
                placeholder="DD/MM/AAAA"
                value={addBoletoForm.vencimento}
                onChange={(e) => setAddBoletoForm({...addBoletoForm, vencimento: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={addBoletoForm.status}
                onChange={(e) => setAddBoletoForm({...addBoletoForm, status: e.target.value})}
              >
                <option value="Pendente">Pendente</option>
                <option value="Atrasado">Atrasado</option>
                <option value="Pago">Pago</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button
              onClick={handleAddBoleto}
              className="btn btn-success"
            >
              Adicionar Boleto
            </button>
            <button
              onClick={() => setShowAddBoletoModal(false)}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-vh-100 bg-light">
      {page === 'splash' && <Splash />}
      {page === 'login' && <Login />}
      
      {['dashboard', 'boletos', 'config'].includes(page) && (
        <>
          <Navbar />
          {page === 'dashboard' && <Dashboard />}
          {page === 'boletos' && <BoletosPage />}
          {page === 'config' && <ConfigPage />}
        </>
      )}
      
      {showNotification && <Notification />}
      {showModal && <Modal />}
      {showAddBoletoModal && <AddBoletoModal />}
    </div>
  );
}