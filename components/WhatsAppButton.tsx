'use client';

export default function WhatsAppButton() {
  const whatsappNumber = '51910593571'; // WhatsApp Palomino Learning Center
  const whatsappMessage = 'Hola! Me gustaría información sobre tus cursos.';
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 group"
      title="Chatea con nosotros en WhatsApp"
      aria-label="Botón de WhatsApp"
    >
      {/* Icono oficial de WhatsApp */}
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.148.529 4.18 1.456 5.975L0 24l6.303-1.444c1.688.936 3.616 1.475 5.697 1.475 6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.85 0-3.607-.451-5.143-1.246l-.369-.215-3.841.885.905-3.766-.233-.371C1.503 15.898 1 14.043 1 12c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10zm5.892-7.597c-.322-.16-1.897-.937-2.192-1.043-.295-.105-.51-.16-.725.16-.215.32-.832 1.04-1.02 1.255-.188.215-.376.242-.698.08-.32-.16-1.355-.499-2.584-1.593-.955-.846-1.6-1.89-1.787-2.21-.188-.32-.02-.494.141-.653.144-.144.32-.376.481-.564.16-.188.213-.32.32-.534.106-.215.053-.402-.026-.564-.08-.16-.725-1.747-.994-2.39-.262-.615-.525-.532-.725-.542-.187-.01-.401-.011-.615-.011-.215 0-.564.08-.859.376-.295.295-1.127 1.101-1.127 2.688s1.153 3.118 1.313 3.333c.16.215 2.253 3.44 5.46 4.827.762.331 1.356.533 1.816.684.765.243 1.461.209 2.01.126.613-.092 1.897-.773 2.162-1.52.265-.746.265-1.386.186-1.52-.08-.135-.294-.215-.616-.375z" />
      </svg>

      {/* Tooltip en hover */}
      <div className="absolute right-16 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        ¿Necesitas ayuda?
        <div className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-gray-900"></div>
      </div>

      {/* Pulse animación */}
      <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-30"></div>
    </a>
  );
}
