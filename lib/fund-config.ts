// Configuración manual del fondo Witleik.
//
// WITX_PRICE_1Y_AGO: precio de $WITX hace 1 año (365 días), en USD.
//
// Ni Jupiter Price API v3 ni el endpoint de DexScreener que usamos en la home
// exponen histórico de precio a 1 año, así que este valor se actualiza A MANO.
// Se usa para calcular el "ROI del fondo · 12 meses":
//   ((precio_actual - WITX_PRICE_1Y_AGO) / WITX_PRICE_1Y_AGO) * 100
//
// ⚠️ ACTUALIZA este número con el precio real de $WITX hace 365 días.
// Si lo dejas en 0 (o negativo), la home mostrará "—" en vez de un ROI incorrecto.
export const WITX_PRICE_1Y_AGO = 0.02208;
