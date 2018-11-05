# Блог 2: Аутентификация и авторизация

## Общие сведения
В этой задаче мы добавим функцию в приложение для блога, подобное тому, которое мы создали в [*blog-1-anonymous-blog-challenge*][blog-1-challenge] (задача создания анонимного блога). В этой задаче каждый может посетить наш сайт и написать, отредактировать или удалить запись в блоге. В этой задаче мы ограничим действия пользователей на нашем сайте, в зависимости от того, являются ли они зарегистрированными пользователями и, если да, то чем они могут пользоваться.

### Аутентификация и авторизация
Основное внимание в этой задаче уделяется тому, кто в нашем приложении имеет разрешение делать что-то и что именно. Подумайте о таких сайтах, как Facebook и Twitter. Нам нужно зарегистрироваться на каждом сайте, прежде чем мы сможем опубликовать обновления статуса или твит. Что происходит после публикации какого-либо контента? Может ли кто-нибудь отредактировать или удалить его, или мы, как авторы контента, ограничиваем это действие?

## Releases
### Пре-релиз: Настройка
Прежде чем мы начнем создавать аутентификацию и авторизацию, нам необходимо сделать настройку сайта. Предоставленная кодовая база предназначена для функционирующего одномодельного приложения CRUD: сайта блога. Давайте рассмотрим код, взглянем на модели, контроллеры, помощников, представления, миграции и т.д. Затем, после создания, миграции и пополнения базы данных, давайте откроем приложение в браузере.

*Примечание:* Если мы хотим запустить любые тесты, нам нужно подготовить тестовую базу данных, используя задачу Rake `db:test:prepare`.

### Release 0: Регистрация пользователя
Начнем с добавления функции аутентификации пользователя. Все, что мы хотим сделать в этом конкретном release, - это разрешить пользователям регистрироваться на нашем сайте, входить и выходить из системы.

Когда пользователи регистрируются, они будут вводить имя пользователя, адрес электронной почты и пароль; они будут входить в систему под своим адресом электронной почты и паролем.

Нам нужно добавить таблицу в нашу базу данных для хранения пользовательских данных. Подумайте, какие ограничения мы должны поместить в нашу базу данных. Нужно ли добавлять индексы для быстрого поиска? Должны ли какие-либо поля быть обязательными и/или уникальными? Нам также понадобится модель для представления пользователей в наших приложениях. Нужны ли в нашей модели какие-либо валидации?

**User Interface Changes** (Изменения пользовательского интерфейса)
- Если ни один пользователь не вошел в систему, ссылки на регистрацию и вход в систему должны появиться в параметрах навигации (см. [mockup](readme-assets/auth-nav-no-user.png)).
- Когда пользователь вошел в систему, имя пользователя и ссылка на выход должны появиться в вариантах навигации (см. [mockup](readme-assets/auth-nav-user.png)).
- Когда пользователь нажимает на ссылку для регистрации, их следует отправить на страницу с формой для отправки имени пользователя, адреса электронной почты и пароля (см. [mockup](readme-assets/registration-form.png)). Нам нужна подобная страница для входа. 
- Если что-то пойдет не так во время регистрации, пользователь должен быть предупрежден о проблеме (см. [mockup](readme-assets/registration-form-show-errors.png)). Аналогичная обратная связь должна предоставляться при сбое входа в систему. 

### Release 1: Ограничение зарегистрированным пользователям на внесение записей 
В этом выпуске мы начнем вводить авторизацию в наше приложение. Пользователи уже могут зарегистрироваться, войти в систему и выйти из системы. Теперь мы хотим изменить наше приложение, чтобы только зарегистрированные пользователи, которые выполнили вход в систему, могли создавать новые записи.

Мы изменим наш пользовательский интерфейс, чтобы скрыть ссылки на новую запись от гостевых пользователей. Просто обновления нашего пользовательского интерфейса недостаточно. Что произойдет, если пользователь перейдет к новой записи не с помощью клика на ссылку, а напрямую введя URL? Что делать, если кто-то делает запрос на создание нового поста из командной строки? Можем ли мы поймать их в наших обработчиках маршрутов?

**User Interface Changes** (Изменения пользовательского интерфейса)
- Когда ни один пользователь не вошел в систему, любые ссылки на новую регистрационную форму должны быть удалены (см. [user logged in mockup](readme-assets/auth-nav-user.png) и [no user mockup](readme-assets/no-user-no-link-to-form.png)). Ссылки для редактирования и удаления поста также должны быть скрыты.
- Если выполнен запрос на получение страницы формы для создания записи, на получение страницы формы для редактирования записи, на создание новой записи, и т.д., но пользователь не вошел в систему, тогда ответ должен предупредить пользователей о том, что что-то пошло не так (см. [mockup](readme-assets/something-went-wrong.png)); эта функция также служит для случая, если какой-либо пользователь пытается получить доступ к записи, которая не существует. 

### Release 2: Ограничить редактирование и удаление записи так, чтобы только автор мог это сделать
Следующим шагом в добавлении авторизации к нашему приложению будет ограничение того, кто может редактировать и удалять определенную запись. Мы хотим, чтобы только автор записи мог редактировать и удалять ее.

Это означает, что нам нужен способ связать пользователей с записями. Когда пользователь создает новую запись, эта новая запись должна быть связана с этим пользователем. Нужно ли нам вносить изменения в нашу базу данных для поддержки этой функции? Нужно ли обновлять наши модели? Как насчет наших контроллеров?

**User Interface Changes** (Изменения пользовательского интерфейса)
- автор записи должен отображаться рядом со временем размещения записи (см. [mockup](readme-assets/index-show-author-username.png)).
- Только автор записи должен иметь возможность видеть любые ссылки для ее редактирования или удаления. 
- Если пользователь, делающий запрос, не является автором записи, тогда, если выполнен запрос на получение страницы формы для редактирования записи, обновления записи, удаления записи, и т.д., ответ должен предупредить пользователей о том, что что-то пошло не так (см. [mockup](readme-assets/something-went-wrong.png)).

### Release 3: Разрешение на показ записи по ее автору
Теперь, когда мы можем связать пользователей и записи, давайте разрешим пользователям видеть записи, написанные конкретным пользователем. Мы хотим использовать вложенный маршрут, например `/users/:id/entries`вЂ”, в зависимости от названий ваших моделей. Когда мы посетим такой маршрут, мы увидим список всех записей, написанных этим конкретным пользователем. 

**User Interface Changes** (Изменения пользовательского интерфейса)
- Имена пользователей должны отображаться как ссылки на страницу с указанием всех записей, написанных этим пользователем (см. [mockup](readme-assets/usernames-as-links.png)). 
- Страница, показывающая все записи конкретного пользователя, должна выглядеть так же, как страница с самыми новыми записями (см. [mockup](readme-assets/user-entries.png)); нам не нужно использовать имя пользователя в качестве ссылки, так как мы уже на странице. 
- Если пользователь пытается увидеть записи, написанные пользователем, которого не существует, ответ должен предупредить пользователей о том, что что-то пошло не так (см. [mockup](readme-assets/something-went-wrong.png)).


## Заключение
Авторизация является важной частью разработки пользовательского интерфейса веб-приложения. Нам нужно контролировать, кто может делать что-то в наших приложениях и что именно. Иногда у нас будет функция, ограниченная небольшой группой пользователей (например, администраторами). В других случаях, нашей целью будет защита пользовательского контента, как это было выполнено в данной задаче. Когда мы будем это делать, мы должны быть осторожными и закрывать любые лазейки, которые приходят нам на ум. Недостаточно просто скрывать ссылки на наших веб-страницах. Также нужно проанализировать наши контроллеры.







#Eng

## Blog 2: Authentication and Authorization

## Summary
In this challenge, we're going to add a feature to a blog application similar to the one that we built in the [*blog-1-anonymous-blog-challenge*][blog-1-challenge].  In that challenge, anyone could visit our site and write, edit, or delete a blog entry.  In this challenge, we're going to restrict what users can do on our site, depending on whether they're registered users and, if so, which users they are.

### Authentication and Authorization
The focus of this challenge is on who has permission to do what in our application.  Think about sites like Facebook and Twitter.  We need to register with each site before we can post status updates or tweet.  What happens after we post some content?  Can just anyone edit it or delete it, or is that behavior restricted to us as the content's author?


## Releases
### Pre-release: Setup
Before we begin implementing authentication and authorization, we need to set up the site.  The provided codebase is for a functioning one-model CRUD application:  a blog site.  Let's browse through the code, taking a look at the models, controllers, helpers, views, migrations, etc.  Then, after creating, migrating, and seeding the database, let's open the application in the browser.

*Note:* If we want to run any tests, we'll need to prepare the test database using the `db:test:prepare` Rake task.


### Release 0: User Signup
Let's begin by adding a user authentication feature.  All we want to do for this particular release is to allow users to register for our site, login, and logout.

When users signup, they will provide a username, e-mail address, and a password; they will login with their e-mail address and password.

We'll need to add a table in our database to hold user data.  Think about what constraints we should place on our database.  Do we need to add any indexes for quick lookup?  Should any fields be required and/or unique?  We'll also need a model to represent users in our applications.  Does our model need any validations?

**User Interface Changes**
- When no user is logged in, links to register and login should appear in the navigation options (see [mockup](readme-assets/auth-nav-no-user.png)).
- When a user is logged in, the user's username and a link to logout should appear in the navigation options (see [mockup](readme-assets/auth-nav-user.png)).
- When a user clicks the link to register, they should be taken to a page with a form for submitting their username, e-mail address, and password (see [mockup](readme-assets/registration-form.png)).  We'll need a similar page for login.
- If something goes wrong during registration, the user should be alerted to the problem (see [mockup](readme-assets/registration-form-show-errors.png)).  Similar feedback should be provided if logging in fails.


### Release 1: Restrict Writing Entries to Registered Users
In this release, we're going to begin to introduce authorization into our application.  Users can already register, login, and logout.  We now want to modify our application so that only users who are registered and logged in are able to create new entries.

We'll modify our user interface to hide links to the new entry form from guest users.  Just updating our user interface isn't enough.  What happens if a user navigates to the new entry form, not by clicking a link, but by entering the URL directly?  What if someone makes a request to create a new post from the command line?  Can we catch these in our route handlers?

**User Interface Changes**
- When no user is logged in, any links to the new entry form should be removed (see [user logged in mockup](readme-assets/auth-nav-user.png) and [no user mockup](readme-assets/no-user-no-link-to-form.png)).  Links for editing and deleting a post should also be hidden.
- If a request is made to get the new entry form page, to get the edit entry form page, to create a new entry, etc. but there is no user logged in, then the response should alert users that something went wrong (see [mockup](readme-assets/something-went-wrong.png)); this is already the behavior if any user tries to access an entry that does not exist.


### Release 2: Restrict Editing and Deleting to Entry Author
Our next step in adding authorization to our application will be to limit who can edit and delete a particular entry.  We want only an entry's author to be able to edit and delete it.

This means that we'll need a way to associate users with entries.  When a user creates a new entry, that new entry should be associated with that user.  Do we need to make changes to our database to support this behavior?  Do we need to update our models?  What about our controllers?

**User Interface Changes**
- The entry's author should be displayed next to the time an entry was written (see [mockup](readme-assets/index-show-author-username.png)).
- Only an entry's author should be able to see any links to edit or delete it.
- Unless the user making the request is the entry's author, if a request is made to get the edit entry form page, to update an entry, to delete an entry, etc., then the response should alert users that something went wrong (see [mockup](readme-assets/something-went-wrong.png)).


### Release 3: Show Entries by Author
Now that we can associate users and entries, let's allow users to see entries written by a particular user.  We'll want to use a nested route, something like `/users/:id/entries`—depending on your model names.  When we visit such a route, we'll see a list of all entries written by that particular user.


**User Interface Changes**
- Usernames should appears as links to a page showing all the entries written by that user (see [mockup](readme-assets/usernames-as-links.png)).
- The page showing all a particular user's entries should look similar to the page showing the most recent entries (see [mockup](readme-assets/user-entries.png)); we don't need to use the username as a link, since we're already on the page.
- If a user attempts to see the entries written by a user that doesn't exist, then the response should alert users that something went wrong (see [mockup](readme-assets/something-went-wrong.png)).


## Conclusion
Authorization is an important part of designing the user experience of a web application.  We need to control who can do what in our applications.  Sometimes we'll have behaviors limited to a small group of users (e.g., administrators).  Other times, we'll want to help protect user content, as we've done in this challenge.  When we do this, we want to be thorough and close any loopholes we can think of.  It's not enough to simply hide links on our webpages.  We need to look at our controllers, too.

[blog-1-challenge]: ../../../express-blog-1-anonymous-blog-challenge
