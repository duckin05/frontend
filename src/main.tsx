import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Blockchain Integrity Check
// ===========================
// App.tsx wraps <BlockchainIntegrityProvider> which:
// 1. Reads blockchain_data.json trực tiếp từ disk qua Vite middleware (/blockchain-data)
// 2. Tính toán SHA-256 hash ngay trên trình duyệt (Web Crypto API)
// 3. So sánh computed hash với stored hash — nếu không khớp => CẢNH BÁO
// 4. Tự động kiểm tra mỗi 30 giây
//
// Ưu điểm: Không cần sửa backend Flask (app.py), phát hiện thay đổi file real-time
//
// Chi tiết: providers/BlockchainIntegrityProvider.tsx

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

