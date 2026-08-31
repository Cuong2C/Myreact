/**
 * Đổi toàn bộ chữ, ảnh nền và thời gian hiệu ứng tại file này.
 * Không cần sửa component khi chỉ muốn đổi nội dung.
 */
export const content = {
  pageTitle: 'LifeTask',

  /** Ảnh nền trời đêm (URL mạng). Để '' nếu chỉ muốn nền đen + sao. */
  backgroundUrl:
    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1600&q=70',

  timings: {
    introFadeMs: 700,
    skyRevealMs: 3200,
    storyDelayMs: 400,
    charMs: 70,
    questionFadeMs: 800,
    heartDrawMs: 3600,
  },

  scene1: {
    question: 'Nơi này chỉ dành cho bé Huyền Trâm, bạn có phải Huyền Trâm?',
    yes: 'Phải',
    no: 'Không',
  },

  scene2: {
    text: 'Anh và em đã tìm hiểu, gặp gỡ, trò chuyện với nhau được một thời gian',
  },

  scene3: {
    question: 'Cho phép anh làm người yêu em nhé ?',
    yes: 'Đồng ý',
    no: 'Không',
  },

  /**
   * Nút Không nhảy ngẫu nhiên quanh nút Đồng ý (px).
   * minAway / maxAway: khoảng cách tâm, không văng ra góc.
   */
  noDodge: {
    minAway: 92,
    maxAway: 150,
  },
} as const
