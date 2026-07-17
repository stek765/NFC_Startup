import { useEffect, useState } from 'react';
import { DEFAULT_CONFIG } from '../catalog';
import type { PlaqueConfig } from '../types';
import { applyBaseColor, sanitizeConfig } from './config';

const STORAGE_KEY = 'nfc-configurator-v1';

function load(): PlaqueConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? sanitizeConfig(JSON.parse(raw)) : { ...DEFAULT_CONFIG };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function useConfig() {
  const [config, setConfig] = useState<PlaqueConfig>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // quota piena (logo grande): la sessione vive comunque in memoria
    }
  }, [config]);

  return {
    config,
    set: <K extends keyof PlaqueConfig>(key: K, value: PlaqueConfig[K]) =>
      setConfig((c) => ({ ...c, [key]: value })),
    setBaseColor: (id: string) => setConfig((c) => applyBaseColor(c, id)),
    reset: () => setConfig({ ...DEFAULT_CONFIG }),
  };
}
