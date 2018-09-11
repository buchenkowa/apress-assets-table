# apress-assets-table

### сборка проекта Yarn:
* ```dev``` - для разработки, вотчит и автоматически пересобирает
```bash
yarn run dev
```
* ```prod``` - делать перед коммитом, пока у нас все это лежит в репозитории.
```bash
yarn run prod
```
Как постаавить Yarn на санчес себе ?
```bash
curl -o- -L https://yarnpkg.com/install.sh | bash
```
#Новые зависимости ставить только через Yarn
```bash
yarn add
```
---
## Тесты:

ссылки:

+ [jest](https://facebook.github.io/jest/)
+ [enzyme](http://airbnb.io/enzyme/)
+ (https://hackernoon.com/testing-react-components-with-jest-and-enzyme-41d592c174f)
+ (http://redux.js.org/docs/recipes/WritingTests.html)
+ (https://youtu.be/59Ndb3YkLKA)

Тесты должны быть документацией к коду.
Описание теста пишем по русски во избежания недорозумений.

Как запускать ? (потом сделаем прекоммит хук)
```bash
yarn run test
yarn run test:watch
yarn run test:coverage
```


### Как внести правки локально в гем assets-table?
1. ```apress-tiger``` подключаем локально. В Gemfile указываем локальную зависимость: ```/localgems/apress-tiger```
2. Так как в apress-tiger + apress-assets не работает yarn link и бандлы приходится подкладывать руками, можно в ```package.json``` не устанавливать зависимость на локальную версию гема apress-assets. Иначе бы мы добавили в package.json гема apress-tiger такую строку: ```file:/ваш_путь_до_гема/gems/apress-assets-table```

3. В ```apress-assets-table``` делаем правку.
3.1 там же запускаем
- ```yarn run prod && sudo cp -R dist ../apress-tiger/node_modules/apress-assets-table```
Эта команда должна собрать бандл и скопировать собранные бандла в папку ```node_modules/apress-assets-table в геме apress-tiger```.
Важно, чтобы на этот момент в геме apress-tiger уже была папка node_modules/apress-assets-table. Если ее нет, заходим в apress-tiger и запускаем yarn

4. После того как в apress-assets-table сделана правка, заходим в гем apress-tiger и выполняем команду
```
yarn run prod
```


### Как исправить что-то в Справке?

Справка находится в apress-assets-table, но бандл для нее собирается в геме ```apress-company_admin```

Т.е получается всё справедливо что и выше, только подкладываем сборку assets-table не в ```apress-tiger```, а в ```apress-company_admin```
И указываем в Gemfile зависимость на локальную разработку в apress-company_admin: ```path: '/localgems/'apress-company_admin```

3. В apress-assets-table в справке делаем правку.
3.1 там же запускаем
- yarn,
- ```yarn run prod && sudo cp -R dist ../apress-company_admin/frontend/node_modules/apress-assets-table``` - сделаем сборку и положим ее в apress-company_admin
Важно обратить внимаение, что в apress-company_admin package.json расположен в папке frontend и поэтому запускать yarn run prod и yarn в apress-company_admin нужно из папки frontend

Если команда копирования не отработала нужно руками скопировать собранные бандлы из ~/projects/gems/apress-assets-table/dist в соответсвующие гемы в папки node_modules/apress-assets-table/dist и после этого запустить сборку yarn prod (уже в нужном геме)
