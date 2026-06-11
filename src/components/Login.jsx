import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLogin, setIsLogin] = useState(true)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) throw error
        setSuccess('Login successful! Redirecting...')
        setTimeout(() => {
          alert('Welcome ' + data.user.email)
        }, 1000)
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              created_at: new Date().toISOString()
            }
          }
        })
        
        if (error) throw error
        
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          setError('User already exists. Please login instead.')
        } else {
          setSuccess('Registration successful! You can now login.')
          setTimeout(() => setIsLogin(true), 2000)
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })
      if (error) throw error
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={styles.logo}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/100x100?text=Logo'
              e.target.onerror = null
            }}
          />
        </div>
        
        <h2 style={styles.title}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <p style={styles.subtitle}>
          {isLogin ? 'Please login to your account' : 'Sign up to get started'}
        </p>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine}></span>
          <span style={styles.dividerText}>OR</span>
          <span style={styles.dividerLine}></span>
        </div>

        <button 
          onClick={handleGoogleLogin}
          style={styles.googleButton}
        >
          <svg style={styles.googleIcon} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div style={styles.switchMode}>
          <span style={styles.switchText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setSuccess('')
              }}
              style={styles.switchButton}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px'
  },
  card: {
    background: '#e0e0e0',
    borderRadius: '50px',
    padding: '50px 40px',
    boxShadow: '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
    width: '100%',
    maxWidth: '450px',
    transition: 'all 0.3s ease'
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  logo: {
    width: '100px',
    height: '100px',
    objectFit: 'contain',
    borderRadius: '30px',
    boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff',
    padding: '10px',
    background: '#e0e0e0'
  },
  title: {
    textAlign: 'center',
    color: '#333',
    fontSize: '28px',
    marginBottom: '10px',
    fontWeight: '600'
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    fontSize: '14px',
    marginBottom: '30px'
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '12px',
    borderRadius: '20px',
    fontSize: '14px',
    marginBottom: '20px',
    textAlign: 'center',
    boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff'
  },
  success: {
    background: '#efe',
    color: '#3c3',
    padding: '12px',
    borderRadius: '20px',
    fontSize: '14px',
    marginBottom: '20px',
    textAlign: 'center',
    boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    color: '#555',
    fontSize: '14px',
    fontWeight: '500',
    marginLeft: '10px'
  },
  input: {
    padding: '15px 20px',
    border: 'none',
    borderRadius: '30px',
    background: '#e0e0e0',
    boxShadow: 'inset 8px 8px 12px #bebebe, inset -4px -4px 8px #ffffff',
    fontSize: '16px',
    color: '#333',
    outline: 'none',
    transition: 'all 0.3s ease'
  },
  button: {
    padding: '15px',
    border: 'none',
    borderRadius: '30px',
    background: '#e0e0e0',
    boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff',
    fontSize: '16px',
    fontWeight: '600',
    color: '#555',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '10px'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '25px 0',
    gap: '10px'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#ccc'
  },
  dividerText: {
    color: '#888',
    fontSize: '12px'
  },
  googleButton: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '30px',
    background: '#e0e0e0',
    boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff',
    fontSize: '14px',
    fontWeight: '500',
    color: '#555',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all 0.2s ease'
  },
  googleIcon: {
    width: '20px',
    height: '20px'
  },
  switchMode: {
    textAlign: 'center',
    marginTop: '25px'
  },
  switchText: {
    color: '#666',
    fontSize: '14px'
  },
  switchButton: {
    background: 'none',
    border: 'none',
    color: '#4a90e2',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    marginLeft: '5px',
    textDecoration: 'underline'
  }
}

export default Login
