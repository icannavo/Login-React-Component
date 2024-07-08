import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../component/ComponenteCSS/Login.scss';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);
  const [captchaState, setCaptchaState] = useState('initial'); // 'initial', 'verifying', 'verified'
  const navigate = useNavigate(); // Adicionado para navegação

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(newEmail)) {
      setEmailError('Por favor, insira um email válido.');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(
        newPassword
      )
    ) {
      setPasswordError(
        'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um caractere especial e ter no mínimo 8 caracteres.'
      );
    } else {
      setPasswordError('');
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCaptchaChange = () => {
    if (captchaState === 'initial') {
      setCaptchaState('verifying');
      setTimeout(() => {
        setIsCaptchaChecked(true);
        setCaptchaState('verified');
      }, 2500); // 2.5 seconds delay
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isCaptchaChecked) {
      alert('Por favor, marque o CAPTCHA antes de enviar o formulário.');
      return;
    }

    console.log('informações foram para o Back-end');
    if (!emailError && !passwordError) {
      const isValidLogin = await fakeBackendLogin(email, password);
      if (isValidLogin) {
        setLoginError('');
        console.log('Login bem-sucedido!');
        navigate('/'); // Redireciona para a Home Page em caso de sucesso
      } else {
        setLoginError('Email ou senha incorretos. Por favor, tente novamente.');
        setShowForgotPassword(true);
        console.log('Email ou senha incorretos ou sem resposta do servidor.');
      }
    } else {
      setLoginError('');
      console.log('Por favor, corrija os erros no formulário.');
    }
    console.log('Email:', email);
    console.log('Senha:', password);
  };

  const fakeBackendLogin = (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'user@example.com' && password === 'Brag@1196') {
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };

  return (
    <div id="login" className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} id="form-login">
        <div className="form-row">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder='Insira seu email'
            value={email}
            onChange={handleEmailChange}
          />
          {emailError && <p className="error invalid-feedback">{emailError}</p>}
        </div>
        <div className="form-row password-container">
          <div className="password-input-wrapper">
            <label htmlFor="password">Senha:</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-control password-input"
                value={password}
                placeholder='Insira sua senha'
                onChange={handlePasswordChange}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="password-toggle-icon"
                onClick={handleTogglePasswordVisibility}
              />
            </div>
            {passwordError && <p className="error invalid-feedback">{passwordError}</p>}
          </div>
        </div>
        <div className="form-row">
          <div className="col-md-6 mb-2">
            <div className="custom-captcha" onClick={handleCaptchaChange}>
              <div className={`captcha-checkbox ${isCaptchaChecked ? 'checked' : ''}`}>
                {isCaptchaChecked && <span>✓</span>}
              </div>
              <div className="captcha-text">
                {captchaState === 'initial' && 'Não sou um robô'}
                {captchaState === 'verifying' && 'Verificando...'}
                {captchaState === 'verified' && 'Verificado'}
              </div>
              <div className="captcha-icon">
                <img className="captcha-icon" src="/assets/img/re.png" alt="Captcha Icon" />
              </div>
            </div>
            {captchaState !== 'verified' && (
              <div className="invalid-feedback d-block">Por favor, marque o CAPTCHA antes de enviar o formulário.</div>
            )}
          </div>
        </div>
        <button type="submit" className="btn" disabled={!isCaptchaChecked}>
          <span>Entrar</span>
        </button>
        {loginError && (
          <p className="error invalid-feedback">
            {loginError}{' '}
            {showForgotPassword && (
              <a href="#" className="forgot-password">Esqueci minha senha</a>
            )}
          </p>
        )}
        <p className="register-link">Não possui uma conta? <a href="#">Cadastre-se</a></p>
      </form>
      <div className="rendered-info">
        <h6>Simulação de resposta de Sucesso:<br /><br /></h6>
        <h6>Email:<br /> user@example.com <br /><br />Password:<br /> Brag@1196</h6>
        <br />
      </div>
    </div>
  );
}

export default Login;
