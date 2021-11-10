
const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require('../middleware/auth')
const User = require("../models/user");

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post(
  "/signup",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const {
      email,
      password
    } = req.body;
    try {
      let user = await User.findOne({
        email
      });
      if (!user) {
        return res.status(400).json({
          message: "Vous n'avez pas accès au site. Si vous pensez que c'est une erreur, veuillez contactez un administrateur."
        });
      }

      if (user.password) {
        return res.status(400).json({
          message: "L'utilisateur existe déjà."
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt)


      await user.save().then(result => console.log(result)).catch(e => console.log(e))

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        "YhdcsNzvVpjoJ9a", {
        expiresIn: 3600 * 24 * 7
      },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token
          });
        }
      );
    } catch (err) {
      res.status(500).send("Error in Saving");
    }
  }
);

router.get('/password', async (req, res) => {
  const password = 'nt-deux2'
  const salt = await bcrypt.genSalt(10);
  const newpassword = await bcrypt.hash(password, salt)
  res.status(200).send(newpassword)
})
router.post('/register', async (req, res) => {
  const user = new User({
    email: req.body.email,
    infos:
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname
    }
  })

  sendSignupMail(req.body.email)

  try {
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (err) {
    res.status(402).json({ message: err.message })
  }
})

router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({
        email
      });
      if (!user) {
        return res.status(400).json({
          message: "L'utilisateur n'existe pas."
        });
      }
      console.log(user)
      if (!user.password) {
        return res.status(400).json({
          message: "L'utilisateur n'existe pas. Appuyez sur \"Première Connexion\"."
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !"
        });

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        "YhdcsNzvVpjoJ9a",
        {
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);

router.get("/me", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

router.get("/all", async (req, res) => {
  await User.find({}, (err, users) => {
    if (err) {
      return res.status(400).json({ success: false, error: err })
    }
    if (!users.length) {
      return res
        .status(404)
        .json({ success: false, error: `Users not found` })
    }
    return res.status(200).json({ success: true, data: users })
  }).catch(err => console.log(err))

});
router.post('/forgot-password', (req, res) => {
  if (req.body.email === '') {
    return res.status(400).send('Veuillez entrez un courriel');
  }
  console.log(req.body.email)
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user === null) {
      return res.status(403).send('Le Courriel n\'est pas valide.')
    } else {
      const token = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = token;
      user.resetPaswwordExpires = Date.now() + 3600000
      console.log(user)
      user.save().then(result => console.log(result)).catch(e => console.log(e))
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: `${process.env.EMAIL_ADDRESS}`,
          pass: `${process.env.EMAIL_PASSWORD}`,
        }
      });

      let mailOptions = {
        from: `${process.env.EMAIL_ADDRESS}`,
        to: `${user.email}`,
        subject: 'Link To Reset Password',
        text:
          'Vous recevez ce courriel car vous (ou quelqu\'un d\'autres) as demandé de changer votre mot de passe pour le site researchexhibition.org\n\n'
          + 'Si vous avez faites la demandes, veuillez vous connecter à l\'adresse suivante : \n\n'
          + `http://admin.researchexhibition.org/reset/${token} \n\n`
          + 'Si vous n\'avez pas fait la demande, veuillez ignorer ce message.'
      };

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.log(err)
          return res.status(404).send('Le courriel n\'as pas pu être envoyé...')
        }
        else {
          return res.status(200).send('Le courriel a bien été envoyé.')
        }
      });
    }
  })
})
router.get('/reset', (req, res, next) => {
  console.log(req.query)
  User.findOne({
    resetPasswordToken: req.query.resetPasswordToken,
    // resetPasswordExpires: {
    //   $gt: Date.now()
    // },
  }).then(user => {
    console.log(user)
    if (user === null) {
      return res.status(404).send({ error: 'Le lien est invalide.' })
    }
    else {
      return res.status(200).send({
        id: user._id,
        message: 'Le lien est valide'
      })
    }
  })
})
router.put('/updatePasswordViaEmail', (req, res, next) => {
  console.log(req.body)
  User.findOne({ _id: req.body.id }).then(async user => {
    if (user !== null) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
      user.resetPasswordToken = null;
      user.resetPaswwordExpires = Date.now()
      await user.save().then(() => {
        return res.status(200).send('Le mot de passe à été mise à jour')
      });
    }
    else {
      return res.status(404).send('L\'utilsateur n\'existe pas')
    }
  })
})

const sendSignupMail = (email) => {
  const transporter = nodemailer.createTransport({
    host: 'mail.labo-nt2.org',
    port: 465,
    secure: true,
    requireTLS: true,
    auth: {
      user: `${process.env.EMAIL_ADDRESS}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    }
  });

  let mailOptions = {
    from: `${process.env.EMAIL_ADDRESS}`,
    to: `${email}`,
    subject: 'Inscrivez vous sur Re|Search',
    text:
      'Vous recevez ce courriel car un administrateur du site Research Exhibition vous invite à vous joindre au site. \n\n'
      + 'Pour vous connecter aller à l\'adresse suivante : \n\n'
      + `http://admin.researchexhibition.org \n\n`
      + 'Puis suivez le lien "Première Connexion"'
  };

  transporter.sendMail(mailOptions, (err, res) => {
    if (err) {
      console.log(err)
      return 'Le courriel n\'as pas pu être envoyé...'
    }
    else {
      return 'Le courriel a bien été envoyé.'
    }
  });
}
module.exports = router;