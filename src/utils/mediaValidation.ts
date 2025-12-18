export const validateMedia = (
  file: File,
  type: "image" | "video" | "audio"
): { valid: boolean; error?: string } => {
  const limits = {
    image: {
      maxSize: 10 * 1024 * 1024,
      types: ["image/jpeg", "image/png", "image/gif"],
    },
    video: {
      maxSize: 100 * 1024 * 1024,
      types: ["video/mp4", "video/webm"],
    },
    audio: {
      maxSize: 20 * 1024 * 1024,
      types: ["audio/mpeg", "audio/wav"],
    },
  } as const;

  const config = limits[type];

  if (!config.types.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported ${type} type. Allowed: ${config.types.join(", ")}`,
    };
  }

  if (file.size > config.maxSize) {
    const mb = Math.round(config.maxSize / (1024 * 1024));
    return {
      valid: false,
      error: `${type} file is too large. Max size is ${mb}MB.`,
    };
  }

  return { valid: true };
};


