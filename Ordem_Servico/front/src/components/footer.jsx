import React from "react";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="text-white p-4 text-center border-t border-gray-500 mt-30 ">
      <div className="flex flex-col items-center max-w-5xl mx-auto">
        <section className="max-w-sm text-center mb-6">
          <h3 className="text-lg font-semibold mb-1">Escola SENAI Roberto Mange</h3>
          <p className="mb-2">Formando profissionais para o futuro.</p>
          <address className="not-italic">
            <p>
              <strong>Endereço:</strong> Rua Pastor Cícero Canuto de Lima, 71 - Campinas, SP
            </p>
            <p>
              <strong>Contato:</strong> (19) 3772-1840 | 
              <a href="mailto:contato@senai.com.br" className="text-blue-400 hover:underline"> contato@senai.com.br</a>
            </p>
          </address>
        </section>

        <section className="text-center">
          <h4 className="text-lg font-semibold mb-2">Redes Sociais</h4>
          <nav className="flex justify-center gap-3">
            <a href="https://facebook.com/senairobertomange" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-gray-700 rounded-full transition hover:bg-blue-400">
              <Facebook size={24} color="white" />
            </a>
            <a href="https://instagram.com/senairobertomange" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-gray-700 rounded-full transition hover:bg-blue-400">
              <Instagram size={24} color="white" />
            </a>
            <a href="https://linkedin.com/senairobertomange" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-gray-700 rounded-full transition hover:bg-blue-400">
              <Linkedin size={24} color="white" />
            </a>
          </nav>
        </section>
      </div>

      <div className="border-t border-gray-500 mt-4 pt-2 text-sm">
        <p>&copy; 2025 SENAI Roberto Mange. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}