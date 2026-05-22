import { Env } from '../types';

/**
 * 1:1 상담 견적 신청을 처리하는 API
 * POST /api/reservations
 */
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { env, request, waitUntil } = context;
    const body = await request.json<any>();

    const {
      client_name,
      phone,
      service_type,
      preferred_date,
      preferred_time,
      has_previous_tattoo,
      note,
      image_url,
    } = body;

    // 필수 유효성 검사
    if (!client_name || !phone || !service_type || !preferred_date || !preferred_time) {
      return new Response(JSON.stringify({ error: '필수 상담 입력 정보가 누락되었습니다.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const id = crypto.randomUUID();

    // 1. D1 데이터베이스에 예약 신청 저장
    await env.DB.prepare(
      `INSERT INTO reservations (id, client_name, phone, service_type, preferred_date, preferred_time, has_previous_tattoo, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        client_name,
        phone,
        service_type,
        preferred_date,
        preferred_time,
        has_previous_tattoo ? 1 : 0,
        note || null
      )
      .run();

    // 2. Discord Webhook 알림 발송 (관리자 실시간 알림)
    // context.env.DISCORD_WEBHOOK_URL 설정이 있을 경우에만 전송
    const webhookUrl = env.DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
      // 엣지 런타임 최적화: 클라이언트 응답 대기 시간을 줄이기 위해 waitUntil을 통해 백그라운드 비동기 fetch 수행
      const sendDiscordNotification = async () => {
        try {
          const origin = new URL(request.url).origin;
          const fullImageUrl = image_url ? `${origin}${image_url}` : null;

          const discordPayload = {
            username: '그레이스 샵 예약 봇',
            avatar_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=200&auto=format&fit=crop',
            embeds: [
              {
                title: '🔔 새로운 1:1 맞춤 견적 신청 접수',
                color: 15124675, // 웜 베이지 계열 색상 코드 (#E6D5C3)
                fields: [
                  { name: '고객명', value: client_name, inline: true },
                  { name: '연락처', value: phone, inline: true },
                  { name: '희망 시술', value: service_type, inline: true },
                  { name: '희망 일시', value: `${preferred_date} ${preferred_time}`, inline: false },
                  { name: '기존 잔흔 여부', value: has_previous_tattoo ? '있음 (사진 확인 요망)' : '없음', inline: true },
                  { name: '추가 요청사항', value: note || '없음', inline: false },
                ],
                image: fullImageUrl ? { url: fullImageUrl } : undefined,
                timestamp: new Date().toISOString(),
              },
            ],
          };

          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(discordPayload),
          });
        } catch (webhookError) {
          console.error('Discord Webhook 전송 실패:', webhookError);
        }
      };

      // waitUntil을 호출하여 본 함수 응답은 즉시 내보내고 알림 전송은 백그라운드 실행
      waitUntil(sendDiscordNotification());
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: '1:1 상담 예약 문의가 정상 접수되었습니다.',
        id,
      }),
      { status: 201, headers: { 'content-type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: '상담 신청 중 서버 오류가 발생했습니다.', details: error.message }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
};
