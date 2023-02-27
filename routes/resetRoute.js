import express from 'express'
const router = express.Router()
import mysql from '../sqlConnect.js'
import * as dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { SMTPClient } from 'emailjs'
import bcrypt from 'bcrypt'
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

router.get('/reset', (req, res) => {
    res.render('reset')
})

router.post('/reset', (req, res) => {
    const { email } = req.body;

    const query = `SELECT * FROM users WHERE email='${email}'`
    mysql.query(query, (err, result) => {
        if (err) console.log(err)
        if (result != '') {

            // *CREATE ONE TIME PASSWORD
            const secret = JWT_SECRET + result[0].password
            const payload = {
                email: result[0].email,
                id: result[0].id
            }

            const token = jwt.sign(payload, secret, { expiresIn: '15m' })
            const link = `http://localhost:5000/reset/${result[0].email}/${token}`
            if (sendmail(link, result[0].email)) {
                res.send({ success: true, message: "A One Time Reset Link Has Been Send To Your Email" })
                console.log(link)
            }

        } else {
            res.send({ success: false, message: 'User is Not Registered' })
        }
    })

})

router.get('/reset/:email/:token', (req, res) => {
    const { email, token } = req.params

    const query = `SELECT * FROM users WHERE email='${email}'`
    mysql.query(query, (err, result) => {
        if (err) console.log(err)
        if (result != '') {
            const secret = JWT_SECRET + result[0].password
            try {
                const payload = jwt.verify(token, secret)

                res.render('reset-password', { email: result[0].email })
            } catch (e) {
                console.log(e.message)
                res.send(e.message)
            }
        } else {
            res.send({ success: false, message: "Invalid ID or Token" })
        }
    })
})

router.post('/reset/:email/:token', (req, res) => {
    const { email, token } = req.params

    const query = `SELECT * FROM users WHERE email='${email}'`
    mysql.query(query, (err, result) => {
        if (err) console.log(err)
        if (result != '') {
            const secret = JWT_SECRET + result[0].password
            try {
                const payload = jwt.verify(token, secret)
                const { password, cpassword } = req.body

                if (password == cpassword) {
                    bcrypt.hash(password, 12, (err, result) => {
                        if (err) res.send({ success: false, message: "Something Went Wrong" })
                        const query = `UPDATE users SET password = '${result}' WHERE email = '${email}'`
                        mysql.query(query, (err, result) => {
                            if (err) { res.send({ success: false, message: "Something Went Wrong" }); console.log(err) }
                            else {
                                console.log(result)
                                res.redirect('/login')
                            }
                        })
                    })
                }
            } catch (e) {
                console.log(e.message)
                res.send(e.message)
            }
        } else {
            res.send({ success: false, message: "Invalid ID or Token" })
        }
    })

})

async function sendmail(link, email) {


    const client = new SMTPClient({
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASSWORD,
        host: process.env.MAIL_SERVER,
        ssl: true,
    });

    const message = {
        text: `Link For Resetting Your SendJack Password`,
        from: process.env.MAIL_USER,
        to: email,
        subject: "SendJack - Password Reset",
        attachment: [
            {
                data: `<!DOCTYPE html>

          <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
          
          <head>
              <title></title>
              <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
              <meta content="width=device-width, initial-scale=1.0" name="viewport" />
              <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
              <style>
                  * {
                      box-sizing: border-box;
                  }
          
                  body {
                      margin: 0;
                      padding: 0;
                  }
          
                  a[x-apple-data-detectors] {
                      color: inherit !important;
                      text-decoration: inherit !important;
                  }
          
                  #MessageViewBody a {
                      color: inherit;
                      text-decoration: none;
                  }
          
                  p {
                      line-height: inherit
                  }
          
                  .desktop_hide,
                  .desktop_hide table {
                      mso-hide: all;
                      display: none;
                      max-height: 0px;
                      overflow: hidden;
                  }
          
                  @media (max-width:520px) {
                      .desktop_hide table.icons-inner {
                          display: inline-block !important;
                      }
          
                      .icons-inner {
                          text-align: center;
                      }
          
                      .icons-inner td {
                          margin: 0 auto;
                      }
          
                      .row-content {
                          width: 100% !important;
                      }
          
                      .mobile_hide {
                          display: none;
                      }
          
                      .stack .column {
                          width: 100%;
                          display: block;
                      }
          
                      .mobile_hide {
                          min-height: 0;
                          max-height: 0;
                          max-width: 0;
                          overflow: hidden;
                          font-size: 0px;
                      }
          
                      .desktop_hide,
                      .desktop_hide table {
                          display: table !important;
                          max-height: none !important;
                      }
                  }
              </style>
          </head>
          
          <body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
              <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;" width="100%">
                  <tbody>
                      <tr>
                          <td>
                              <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1"
                                  role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                  <tbody>
                                      <tr>
                                          <td>
                                              <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                  class="row-content stack" role="presentation"
                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; border-radius: 6px; width: 500px;"
                                                  width="500">
                                                  <tbody>
                                                      <tr>
                                                          <td class="column column-1"
                                                              style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 30px; padding-right: 30px; vertical-align: top; padding-top: 30px; padding-bottom: 30px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                              width="100%">
                                                              <table border="0" cellpadding="0" cellspacing="0"
                                                                  class="image_block block-1" role="presentation"
                                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                  width="100%">
                                                                  <tr>
                                                                      <td class="pad"
                                                                          style="width:100%;padding-right:0px;padding-left:0px;">
                                                                          <div align="center" class="alignment"
                                                                              style="line-height:10px"><img
                                                                                  src="https://i.imgur.com/0SGF2KY.png"
                                                                                  style="display: block; height: auto; border: 0; width: 220px; max-width: 100%;"
                                                                                  width="220" /></div>
                                                                      </td>
                                                                  </tr>
                                                              </table>
                                                              <table border="0" cellpadding="10" cellspacing="0"
                                                                  class="divider_block block-2" role="presentation"
                                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                  width="100%">
                                                                  <tr>
                                                                      <td class="pad">
                                                                          <div align="center" class="alignment">
                                                                              <table border="0" cellpadding="0" cellspacing="0"
                                                                                  role="presentation"
                                                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                                  width="100%">
                                                                                  <tr>
                                                                                      <td class="divider_inner"
                                                                                          style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;">
                                                                                          <span> </span></td>
                                                                                  </tr>
                                                                              </table>
                                                                          </div>
                                                                      </td>
                                                                  </tr>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                              <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2"
                                  role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                  <tbody>
                                      <tr>
                                          <td>
                                              <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                  class="row-content stack" role="presentation"
                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; border-radius: 0; width: 500px;"
                                                  width="500">
                                                  <tbody>
                                                      <tr>
                                                          <td class="column column-1"
                                                              style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                              width="100%">
                                                              <table border="0" cellpadding="0" cellspacing="0"
                                                                  class="heading_block block-1" role="presentation"
                                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                  width="100%">
                                                                  <tr>
                                                                      <td class="pad" style="width:100%;text-align:center;">
                                                                          <h1
                                                                              style="margin: 0; color: #555555; font-size: 23px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; line-height: 120%; text-align: center; direction: ltr; font-weight: 700; letter-spacing: normal; margin-top: 0; margin-bottom: 0;">
                                                                              <span class="tinyMce-placeholder">Your Link For
                                                                                  Resetting The Password</span></h1>
                                                                      </td>
                                                                  </tr>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                              <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3"
                                  role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                  <tbody>
                                      <tr>
                                          <td>
                                              <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                  class="row-content stack" role="presentation"
                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; border-radius: 0; width: 500px;"
                                                  width="500">
                                                  <tbody>
                                                      <tr>
                                                          <td class="column column-1"
                                                              style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                              width="100%">
                                                              <table border="0" cellpadding="10" cellspacing="0"
                                                                  class="paragraph_block block-1" role="presentation"
                                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                                  width="100%">
                                                                  <tr>
                                                                      <td class="pad">
                                                                          <div
                                                                              style="color:#000000;font-size:14px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:left;direction:ltr;letter-spacing:0px;mso-line-height-alt:16.8px;">
                                                                              <p style="margin: 0;">Click below for resetting your
                                                                                  password. This Link is Valid for 15 minutes.</p>
                                                                          </div>
                                                                      </td>
                                                                  </tr>
                                                              </table>
                                                              <table border="0" cellpadding="10" cellspacing="0"
                                                                  class="button_block block-2" role="presentation"
                                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                  width="100%">
                                                                  <tr>
                                                                      <td class="pad">
                                                                          <div align="center" class="alignment">
                                                                              <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:38px;width:80px;v-text-anchor:middle;" arcsize="11%" stroke="false" fillcolor="#3AAEE0"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:14px"><![endif]-->
                                                                              <div
                                                                                  style="cursor: pointer; text-decoration:none;display:inline-block;color:#ffffff;background-color:#3AAEE0;border-radius:4px;width:auto;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;text-align:center;mso-border-alt:none;word-break:keep-all;">
                                                                                  <span
                                                                                      style="padding-left:20px;padding-right:20px;font-size:14px;display:inline-block;letter-spacing:normal;"><span
                                                                                          style="line-height: 28px;"><a href='${link}' style="text-decoration: none; color: white;"> Reset Password</a></span></span></div>
                                                                              <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                                                          </div>
                                                                      </td>
                                                                  </tr>
                                                              </table>
                                                              <table border="0" cellpadding="0" cellspacing="0"
                                                                  class="html_block block-4" role="presentation"
                                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                  width="100%">
                                                                  <tr>
                                                                      <td class="pad" style="padding-top:25px;">
                                                                          <div align="center"
                                                                              style="font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;">
                                                                              <p>Not Working? Paste This Link in Your Browser:</p>
                                                                              <br />
                                                                              <a href="${link}">${link}</a>
                                                                              <br />
                                                                          </div>
                                                                      </td>
                                                                  </tr>
                                                              </table>
                                                              <table border="0" cellpadding="10" cellspacing="0"
                                                                  class="divider_block block-5" role="presentation"
                                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                  width="100%">
                                                                  <tr>
                                                                      <td class="pad">
                                                                          <div align="center" class="alignment">
                                                                              <table border="0" cellpadding="0" cellspacing="0"
                                                                                  role="presentation"
                                                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                                  width="100%">
                                                                                  <tr>
                                                                                      <td class="divider_inner"
                                                                                          style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;">
                                                                                          <span> </span></td>
                                                                                  </tr>
                                                                              </table>
                                                                          </div>
                                                                      </td>
                                                                  </tr>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                              <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4"
                                  role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                  <tbody>
                                      <tr>
                                          <td>
                                              <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                  class="row-content stack" role="presentation"
                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; border-radius: 0; width: 500px;"
                                                  width="500">
                                                  <tbody>
                                                      <tr>
                                                          <td class="column column-1"
                                                              style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                              width="25%">
                                                              <table border="0" cellpadding="0" cellspacing="0"
                                                                  class="paragraph_block block-2" role="presentation"
                                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                                  width="100%">
                                                                  <tr>
                                                                      <td class="pad"
                                                                          style="padding-top:15px;padding-right:10px;padding-bottom:15px;padding-left:10px;">
                                                                          <div
                                                                              style="color:#000000;font-size:14px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:left;direction:ltr;letter-spacing:0px;mso-line-height-alt:16.8px;">
                                                                              <p style="margin: 0; margin-bottom: 16px;">Regards,
                                                                              </p>
                                                                              <p style="margin: 0;">The SendJack Team</p>
                                                                          </div>
                                                                      </td>
                                                                  </tr>
                                                              </table>
                                                          </td>
                                                          <td class="column column-2"
                                                              style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                              width="75%">
                                                              <table border="0" cellpadding="0" cellspacing="0"
                                                                  class="empty_block block-2" role="presentation"
                                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                  width="100%">
                                                                  <tr>
                                                                      <td class="pad"
                                                                          style="padding-right:0px;padding-bottom:5px;padding-left:0px;padding-top:5px;">
                                                                          <div></div>
                                                                      </td>
                                                                  </tr>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                              <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5"
                                  role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                  <tbody>
                                      <tr>
                                          <td>
                                              <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                  class="row-content stack" role="presentation"
                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;"
                                                  width="500">
                                                  <tbody>
                                                      <tr>
                                                          <td class="column column-1"
                                                              style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                              width="100%">
                                                              <table border="0" cellpadding="0" cellspacing="0"
                                                                  class="icons_block block-1" role="presentation"
                                                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                  width="100%">
                                                                  <tr>
                                                                      <td class="pad"
                                                                          style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                                                          <table cellpadding="0" cellspacing="0"
                                                                              role="presentation"
                                                                              style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                              width="100%">
                                                                              <tr>
                                                                                  <td class="alignment"
                                                                                      style="vertical-align: middle; text-align: center;">
                                                                                      <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                                                                      <!--[if !vml]><!-->
                                                                                      <table cellpadding="0" cellspacing="0"
                                                                                          class="icons-inner" role="presentation"
                                                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">
                                                                                          <!--<![endif]-->
                                                                                      </table>
                                                                                  </td>
                                                                              </tr>
                                                                          </table>
                                                                      </td>
                                                                  </tr>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </td>
                      </tr>
                  </tbody>
              </table><!-- End -->
          </body>
          
          </html>`,
                alternative: true,
            },
        ],
    };

    // send the message and get a callback with an error or details of the message that was sent
    let send = true
    client.send(message, function (err, message) {
        console.log(err || message)
        if (err) {
            send = false
        } else {
            send = true
        }
    });

    if (send) {
        return true;
    } else {
        return false;
    }
}

export default router;