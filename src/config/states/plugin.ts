import { PLUGIN_ID } from '@/lib/global';
import { createConfig, getConditionField, getUpdatedStorage } from '@/lib/plugin';
import { restoreStorage } from '@konomi-app/kintone-utilities';
import { produce } from 'immer';
import { atom, selector, selectorFamily } from 'recoil';

const PREFIX = 'plugin';

export const storageState = atom<kintone.plugin.Storage>({
  key: `${PREFIX}storageState`,
  default: restoreStorage<kintone.plugin.Storage>(PLUGIN_ID) ?? createConfig(),
});

export const loadingState = atom<boolean>({
  key: `${PREFIX}loadingState`,
  default: false,
});

export const tabIndexState = atom<number>({
  key: `${PREFIX}tabIndexState`,
  default: 0,
});

export const conditionsState = selector<kintone.plugin.Condition[]>({
  key: `${PREFIX}conditionsState`,
  get: ({ get }) => {
    const storage = get(storageState);
    return storage?.conditions ?? [];
  },
});

export const conditionState = selectorFamily<kintone.plugin.Condition | null, number>({
  key: `${PREFIX}conditionState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      const storage = get(storageState);
      return storage.conditions[conditionIndex] ?? null;
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        produce(current, (draft) => {
          draft.conditions[conditionIndex] = newValue as kintone.plugin.Condition;
        })
      );
    },
});

export const fieldState = selector<string>({
  key: `${PREFIX}fieldState`,
  get: ({ get }) => {
    const conditionIndex = get(tabIndexState);
    return getConditionField(get(storageState), {
      conditionIndex,
      key: 'field',
      defaultValue: '',
    });
  },
  set: ({ get, set }, newValue) => {
    const conditionIndex = get(tabIndexState);
    set(storageState, (current) =>
      getUpdatedStorage(current, {
        conditionIndex,
        key: 'field',
        value: newValue as string,
      })
    );
  },
});

export const targetViewsState = selector<kintone.plugin.EventType[]>({
  key: `${PREFIX}targetViewsState`,
  get: ({ get }) => {
    const conditionIndex = get(tabIndexState);
    return getConditionField(get(storageState), {
      conditionIndex,
      key: 'targetEvents',
      defaultValue: [],
    });
  },
  set: ({ get, set }, newValue) => {
    const conditionIndex = get(tabIndexState);
    set(storageState, (current) =>
      getUpdatedStorage(current, {
        conditionIndex,
        key: 'targetEvents',
        value: newValue as kintone.plugin.EventType[],
      })
    );
  },
});
