import { atom } from 'recoil';

export const adminTokenState = atom({
  key: 'adminTokenState',
  default: null,
});

export const adminDataState = atom({
  key: 'adminDataState',
  default: {},
});

export const sirenAlertsState = atom({
  key: 'sirenAlertsState',
  default: [],
});