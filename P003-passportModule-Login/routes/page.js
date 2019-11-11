const express = require('express'); 
const {isLoggedIn,isNotLoggedIn} = require('./middlewares');
const router = express.Router();



router.get('/profile',isLoggedIn,(req,res)=>{


    //req.user의 생김새
    /*
     user {
          dataValues:
                          { id: 1,
                            email: 'dala1207@naver.com',
                            nick: '달아',
                            password:
                              '$2b$12$xNb1gzZvIxJI5HnNZNMos.5cQN9./CyUYhUQgNCyXaXrbxPAD69eK',
                            provider: 'local',
                            snsId: null,
                            createdAt: 2019-10-15T00:27:05.004Z,
                            updatedAt: 2019-10-15T00:27:05.004Z,
                            deletedAt: null,
                            Followers: [],
                            Followings: [] },
  _previousDataValues:
                          { id: 1,
                            email: 'dala1207@naver.com',
                            nick: '달아',
                            password:
                              '$2b$12$xNb1gzZvIxJI5HnNZNMos.5cQN9./CyUYhUQgNCyXaXrbxPAD69eK',
                            provider: 'local',
                            snsId: null,
                            createdAt: 2019-10-15T00:27:05.004Z,
                            updatedAt: 2019-10-15T00:27:05.004Z,
                            deletedAt: null,
                            Followers: [],
                            Followings: [] },
  _changed: {},
  _modelOptions:
                          { timestamps: true,
                            validate: {},
                            freezeTableName: false,
                            underscored: false,
                            paranoid: true,
                            rejectOnEmpty: false,
                            whereCollection: { id: 1 },
                            schema: null,
                            schemaDelimiter: '',
                            defaultScope: {},
                            scopes: {},
                            indexes: [],
                            name: { plural: 'users', singular: 'user' },
     omitNull: false,
     sequelize:
                        Sequelize {
                          options: [Object],
                          config: [Object],
                          dialect: [MssqlDialect],
                          queryInterface: [QueryInterface],
                          models: [Object],
                          modelManager: [ModelManager],
                          connectionManager: [ConnectionManager],
                          importCache: {} },
                          hooks: {} },
  _options:
                        { isNewRecord: false,
                          _schema: null,
                          _schemaDelimiter: '',
                          include: [ [Object], [Object] ],
                          includeNames: [ 'Followers', 'Followings' ],
                          includeMap: { Followers: [Object], Followings: [Object] },
                          includeValidated: true,
                          attributes:
                            [ 'id',
                              'email',
                              'nick',
                              'password',
                              'provider',
                              'snsId',
                              'createdAt',
                              'updatedAt',
                              'deletedAt' ],
                          raw: true },
                        isNewRecord: false,
                        Followers: [],
                        Followings: [] } 
     */
    res.render('profile',{title:'내 정보 - TEST', user: req.user});


}); 
                    //▼로그인 한 상태가 아니므로 회원가입 창이 나오는 것이고...
router.get('/join',isNotLoggedIn,(req,res)=>{

    res.render('join',{
        title:'회원가입  -  TEST',
        user: req.user,
        joinError:req.flash('join Error'),                
    });


}); 



router.get('/',(req,res,next)=>{

    res.render('main',{
        title:'TEST',
        twits:[],
        user:req.user,
        loginError:req.flash('loginError'),
    });

}); 

module.exports = router; 
