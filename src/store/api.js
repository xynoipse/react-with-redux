import { createAction } from '@reduxjs/toolkit';

export const apiRequest = createAction('api/request');
export const apiRequestSuccess = createAction('api/requestSuccess');
export const apiRequestFailed = createAction('api/requestFailed');
