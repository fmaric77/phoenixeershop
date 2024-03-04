import { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { useRouter } from 'next/router';
import styles from '../styles/LoginForm.module.css';

export default function LoginForm() {
    const { setUser } = useContext(UserContext);
    const [username, setUsername] = useState(process.env.DB_USERNAME);
    const [password, setPassword] = useState(process.env.DB_PASSWORD);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const { status } = await response.json();
            console.log(status);
            setUser({ username });
            router.push('/admin');
        } else {
            console.log('Incorrect username or password');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.loginForm}>
            <label className={styles.label}>
                Username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={styles.textInput} />
            </label>
            <label className={styles.label}>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.passwordInput} />
            </label>
            <input type="submit" value="Submit" className={styles.submitButton} />
        </form>
    );
}