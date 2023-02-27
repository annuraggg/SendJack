
# SendJack

THIS IS JUST A PROTOTYPE CREATED FOR FUN

SendJack is an all-in-one courier and delivery app. With SendJack, customers can quickly, easily, and securely send packages around the world. We provide fast delivery, real-time tracking, and simple pricing to make shipping easy for everyone. Whether you're a business or an individual, SendJack is the perfect solution for your shipping needs.
## Features

- Light/dark mode toggle
- Live previews
- Fullscreen mode
- Cross platform

- Real-time tracking: Keep up-to-date with where your package is at all times.
- Fast delivery: Get your package to its destination in less time than ever.
- Simple pricing: Get great value for your money and get your package to its destination for less.
- Intuitive design: Our app has been intuitively designed to provide an effortless experience.
## Run Locally

Clone the project

```bash
  git clone https://github.com/annuraggg/SendJack
```

Go to the project directory

```bash
  cd SendJack
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Tech Stack

**Client:** Handlebars, Vanilla JavaScript and CSS

**Server:** Node, Express, SQL


## Environment Variables

SQL Database. The Database Name Should be *sendjack*

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `DATABASE_USER` | `string` | **Required**. Your SQL Database Username |
| `DATABASE_PASSWORD` | `string` | **Required**. Your SQL Database Password |

Mail Account

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `MAIL_SERVER`      | `string` | **Required**.The Server Address of Your Email Server |
| `MAIL_USER`      | `string` | **Required**.The Email / Username of Your Account to Send Emails From |
| `MAIL_PASSWORD`      | `string` | **Required**.Account Password |

JWT Tokens

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `JWT_SECRET`      | `string` | **Required**.The JWT Secret for JWT Cookies |

Cookie Session

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `COOKIE_KEY`      | `string` | **Required**.The Cookie Secret for Cookies |

Google OAuth2.0

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `OAUTH_CLIENT_ID_LOGIN`      | `string` | **Required**.Google OAuth Credential - Client ID for Login |
| `OAUTH_CLIENT_SECRET_LOGIN`      | `string` | **Required**.Google OAuth Credential - Client Secret for Login |
| `OAUTH_CLIENT_ID_SIGNUP`      | `string` | **Required**.Google OAuth Credential - Client ID for Signup |
| `OAUTH_CLIENT_SECRET_SIGNUP`      | `string` | **Required**.Google OAuth Credential - Client Secret for Signup |




## Demo

Yet To Come. I will launch it as soon as the project is ready :p

## Feedback

If you have any feedback, please reach out to me at anuragsawant@duck.com

