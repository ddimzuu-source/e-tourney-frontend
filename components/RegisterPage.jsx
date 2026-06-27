import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // Pakai axios mentah bawaan library

export default function RegisterPage() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Dipaksa langsung nembak ke URL Ngrok + /api/register secara manual
            await axios.post('https://shrewdly-hastily-curry.ngrok-free.dev/api/register', formData, {
                headers: {
                    'ngrok-skip-browser-warning': 'any-value',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            alert("Registrasi berhasil! Silakan login.");
            navigate('/login');
        } catch (err) {
            alert("Gagal daftar: " + (err.response?.data?.message || "Cek input lu"));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a1a14] p-6">
            <div className="w-full max-w-md bg-[#0d1f1a] border border-[#1a3d30] p-8 rounded-xl shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Buat Akun Peserta</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        className="w-full p-3 bg-[#0a1a14] border border-[#1a3d30] rounded-lg text-white"
                        placeholder="Nama Lengkap" 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <input 
                        className="w-full p-3 bg-[#0a1a14] border border-[#1a3d30] rounded-lg text-white"
                        type="email" placeholder="Email" 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <input 
                        className="w-full p-3 bg-[#0a1a14] border border-[#1a3d30] rounded-lg text-white"
                        type="password" placeholder="Password" 
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button className="w-full py-3 bg-[#1a9e75] text-white rounded-lg font-semibold hover:bg-[#158562] transition">
                        Daftar Sekarang
                    </button>
                </form>
                <p className="text-center text-[#7ab89e] mt-4 text-sm">
                    Sudah punya akun? <Link to="/login" className="text-[#1a9e75] underline">Masuk di sini</Link>
                </p>
            </div>
        </div>
    );
}