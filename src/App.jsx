import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import Comments from './components/Comments'

function App() {
    const [status, setStatus] = useState('Checking Supabase connection...')

    useEffect(() => {
        async function checkConnection() {
            try {
                const { data, error } = await supabase.from('comments').select('count', { count: 'exact', head: true })
                if (error) {
                    console.error('Supabase Connection Error:', error)
                    setStatus(`Supabase connection error: ${error.message}. (Table: 'comments')`)
                } else {
                    setStatus('Hello World! Supabase connection successful.')
                }
            } catch (err) {
                console.error('Catch error:', err)
                setStatus(`Unexpected error: ${err.message}`)
            }
        }
        checkConnection()
    }, [])

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            fontFamily: 'Inter, system-ui, sans-serif',
            background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
            color: 'white',
            width: '100%',
            boxSizing: 'border-box',
            textAlign: 'center'
        }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'fadeIn 2s' }}>
                Automated Antigravity Develop, Commit and Deploy Cycle Example
            </h1>
            <p style={{
                fontSize: '1.2rem',
                opacity: 0.9,
                maxWidth: '800px',
                lineHeight: '1.6',
                marginBottom: '2rem'
            }}>
                This is a React app solution, sitting on a development framework of Vibe Coding, GitHub, Vercel and Supabase.
            </p>
            <p style={{ fontSize: '1rem', opacity: 0.7, marginBottom: '2rem' }}>{status}</p>

            <Comments />

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    )
}

export default App
