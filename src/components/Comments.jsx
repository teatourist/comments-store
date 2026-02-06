import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Comments() {
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [message, setMessage] = useState('')
    const [fetchedComments, setFetchedComments] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!comment.trim()) return
        if (comment.length > 500) {
            setMessage('Error: Comment must be 500 characters or less.')
            return
        }

        setIsSubmitting(true)
        setMessage('')

        try {
            const { error } = await supabase
                .from('comments')
                .insert([{ content: comment }])

            if (error) {
                console.error('Supabase error during insert:', error)
                throw error
            }

            setComment('')
            setMessage('Comment submitted successfully!')
            // Auto-refresh today's comments if the list is already showing
            if (fetchedComments.length > 0) {
                fetchTodaysComments()
            }
        } catch (err) {
            console.error('Submission catch block:', err)
            setMessage(`Error: ${err.message}. (Table: 'comments', Column: 'content')`)
        } finally {
            setIsSubmitting(false)
        }
    }

    const fetchTodaysComments = async () => {
        setIsFetching(true)
        setMessage('')

        try {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const todayISO = today.toISOString()

            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .gte('created_at', todayISO)
                .order('created_at', { ascending: false })

            if (error) throw error

            setFetchedComments(data || [])
            if (!data || data.length === 0) {
                setMessage("No comments found for today.")
            }
        } catch (err) {
            console.error('Fetch error:', err)
            setMessage(`Error fetching comments: ${err.message}`)
        } finally {
            setIsFetching(false)
        }
    }

    return (
        <div style={{
            marginTop: '2rem',
            width: '100%',
            maxWidth: '600px',
            padding: '20px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Leave a comment..."
                    rows="4"
                    maxLength={500}
                    style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        outline: 'none',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: '#333'
                    }}
                />
                <button
                    type="submit"
                    disabled={isSubmitting || !comment.trim()}
                    style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#0d9488',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: (isSubmitting || !comment.trim()) ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s',
                        opacity: (isSubmitting || !comment.trim()) ? 0.7 : 1
                    }}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Comment'}
                </button>
            </form>

            <button
                onClick={fetchTodaysComments}
                disabled={isFetching}
                style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: isFetching ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s'
                }}
            >
                {isFetching ? 'Fetching...' : "Fetch Today's Comments"}
            </button>

            {message && (
                <p style={{
                    fontSize: '0.9rem',
                    color: message.startsWith('Error') ? '#fca5a5' : '#86efac',
                    margin: 0
                }}>
                    {message}
                </p>
            )}

            {fetchedComments.length > 0 && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    paddingRight: '5px',
                    textAlign: 'left'
                }}>
                    <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', paddingBottom: '5px' }}>
                        Today's Activity
                    </h3>
                    {fetchedComments.map((c) => (
                        <div key={c.id} style={{
                            padding: '10px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <p style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{c.content}</p>
                            <small style={{ opacity: 0.7, fontSize: '0.8rem' }}>
                                {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </small>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
