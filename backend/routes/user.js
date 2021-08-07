// ================================================================================
// User Router
// Quick note: Request param with ? is optional
// ================================================================================
import express from 'express';
import CF from '../config.js';
import User from '../components/user.js';
import { checkLogin, checkPermission } from '../components/lib/userlib.js';
import { isStringJSON } from '../lib/globallib.js';
import RESULT from '../lib/result.js';
export const userRouter = express.Router();
const user = new User();

/**
 * @todo Add user avatar upload
 */

// GET -------------------------------------------------------------------------------------------------------
// GET "/" - list users (default)
userRouter.get('/', async (req, res) => {
  const result = await user.listUsers(0, CF.ROWS, '', false, []);

  res.send(result);
});

// GET "/verify" - verify login
userRouter.get('/verify', async (req, res) => {
  const result = await checkLogin(req);

  res.send(result);
});

// GET "/permission" - return current user's permissions
userRouter.get('/permission', async (req, res) => {
  const result = await checkPermission(req);

  res.send(result);
});

// GET "/logout" - logout
userRouter.get('/logout', async (req, res) => {
  const result = await user.doLogout(res);
  res.send(result)
});

// GET "/:id" - Show specific user by ID | PARAM: id
userRouter.get('/:id', async (req, res) => {
  const id = req.params.id ?? 0;

  const result = await user.showUserByID(id);

  res.send(result);
});


// PUT -------------------------------------------------------------------------------------------------------
// PUT "/" - list users (with param for sort/filter) | BODY: ?page, ?count, ?row, ?dsc, ?filter
userRouter.put('/', async (req, res) => {
  const page = req.body?.page || 0;                        // page - number
  const count = req.body?.count || 25;                     // count - number
  const colSort = req.body?.column || '';                  // row - string
  const asc = (req.body?.dsc) ? false : true;              // dsc - string (true if undefined)
  let filter = [];                                         // filter - { columnName: value }[]
  if (isStringJSON(req.body?.filter)) { filter = JSON.parse(req.body?.filter); }
  const result = await user.listUsers(page, count, colSort, asc, filter);

  res.send(result);
});

// PUT "/login" - login | BODY: username, password
userRouter.put('/login', async (req, res) => {
  const username = req.body?.username || '0';
  const password = req.body?.password || '0';
  let result;

  result = await user.doLogin(username, password, res);

  res.send(result);
});


// PATCH ------------------------------------------------------------------------------------------------------
// PATCH "/:id" - update user profile settings | PARAM: id, BODY: data
userRouter.patch('/:id', async (req, res) => {
  const _uid = req.params.id || '';        // id - string
  let _dat = [];                           // data - { columnName: string }[]
  if (isStringJSON(req.body?.data)) { _dat = JSON.parse(req.body?.data); }

  const result = await user.updateUserProfile(req, _uid, _dat);

  res.send(result);
});


// POST ------------------------------------------------------------------------------------------------------
// POST "/" - register | BODY: username, password, email
userRouter.post('/', async (req, res) => {
  const _usr = req.body?.username || '';
  const _pas = req.body?.password || '';
  const _ema = req.body?.email || '';

  const result = await user.doRegister(req, _usr, _pas, _ema);
  res.send(result);
});

// POST "/password" - Update password for current user | BODY: oldpassword, newpassword
userRouter.post('/password', async (req, res) => {
  const _oPass = req.body?.oldpassword ?? '';
  const _nPass = req.body?.newpassword ?? '';
  let result;

  result = await user.updatePassword(req, _oPass, _nPass);
  res.status(201).send(result);
});

// POST "/email" - Update email for current user | BODY: password, email
userRouter.post('/email', async (req, res) => {
  const _pass = req.body?.password ?? '';
  const _emai = req.body?.email ?? '';

  const result= await user.updateEmail(req, _pass, _emai);
  res.send(result);
});


// DELETE -------------------------------------------------------------------------------------------------------
// DELETE "/:id" - Delete a user (root admin only) | PARAM: id
userRouter.delete('/:id', async (req, res) => {
  const uid = req.params?.id || 0; // user ID
  const result = await user.deleteUser(req, uid);
  res.send(result);
});