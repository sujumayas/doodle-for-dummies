'use client';

import Link from "next/link";
import { Calendar, Clock, Users, Mail } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Doodle para Principiantes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            La forma más simple de gestionar la agenda de tu jefe. Crea horarios
            disponibles y comparte enlaces personalizados para que otros puedan
            reservar.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Gestión Simple</h3>
            <p className="text-gray-600">
              Crea y administra horarios disponibles fácilmente
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Reservas Instantáneas</h3>
            <p className="text-gray-600">
              Los usuarios reservan en tiempo real sin conflictos
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Enlaces Personalizados</h3>
            <p className="text-gray-600">
              Cada persona recibe su propio enlace de reserva
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Mail className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sin Complicaciones</h3>
            <p className="text-gray-600">
              Interfaz simple y directa, sin funciones innecesarias
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ¿Listo para empezar?
            </h2>
            <div className="space-y-4">
              <Link
                href="/admin"
                className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Crear Nuevo Evento
              </Link>
              <p className="text-sm text-gray-500">
                Como administrador, puedes crear y gestionar eventos de agenda
              </p>
            </div>
          </div>
        </div>

        {/* Demo Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">¿Quieres ver cómo funciona?</p>
          <Link
            href="/demo"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Ver demo con datos de ejemplo
          </Link>
        </div>
      </div>
    </div>
  );
}
