# ReactProject

Project Description
Design and implement a Forum System, where the users can create posts, add
comments, and upvote/downvote the things that they like or dislike the most.
Choose what your forum will be about and stick with it. Examples: an automotive
fanbase forum, java technical learning forum, crypto trading forum, fashion forum,
etc. The forum should revolve around one or two general topics.
Functional Requirements
Entities (documents)
• Authentication is handled by Firebase, there is no need for auth entity
• Each user must have a first and last name, email and/or username
o First name and last name must be between 4 and 32 symbols.
o Email must be a valid email and unique in the system.
• Each admin must have a first and last name, email, and may have a phone
number.
o First name and last name must be between 4 and 32 symbols.
o Email must be a valid email and unique in the system.
• Each post must have a user who created it, a title, content, comments and
how many likes it has received.
o The title must be between 16 and 64 symbols.
o The content must be between 32 symbols and 8192 symbols.
o The post must have a user who created it.
o Other users must be able to post replies.
Public Part
The public part must be accessible without authentication.
On the home page, anonymous users must be presented with the core features of
the platform as well as how many people are using it and how many posts have
been created so far.
Anonymous users must be able to register and log in.
Anonymous users should be able to see a list of the top 10 most commented posts
and a list of the 10 most recently created posts.
Private part
Accessible only if the user is authenticated.
The user must be able to log in and log out.
Users must be able to browse posts created by the other users with an option to sort
and filter them.
Users must be able to view a single post including its title, content, comments, likes,
etc. The details of the post and any available user actions (comment/like/edit) should
be presented on the same page.
Users must be able to update their profile information. Users should not be able to
change their username once registered. Users could upload a profile photo.
Users must be able to create a new post with at least a title and content.
Each user must be able to edit only personal posts or comments.
Each user must be able to view all their or any other user’s posts and comments
(with the option to filter and sort them).
Each user must be able to remove one or more of their own posts. Deleting a post
should be available while reading the details of an individual post or when browsing
the list of all posts.
Each user must be able to comment/reply to any other forum post.
Administrative part
Accessible to users with administrative privileges.
Admin must be able to search for a user by their username, email, or display name.
Admin must be able to block or unblock individual users. A blocked user must not
be able to create posts or comments.
Admin must be able to delete any post.
Admin must be able to view a list of all posts with an option to filter and sort them.
Optional feature
Post Tags – In order for the users to navigate easier and find certain topics faster,
you can implement tags. A tag is additional information that can be put under each
post after creating the post. The process of adding a tag/s to a post is as follows: The
user creates a post, then proceeds to edit the post, once on the edit post page, the
user can add a tag/s under it. If the tag does not exist, a new one must be added to
the database. If the tag exists, a new one must not be created, the one already in the
database must be reused. All tags should be lowercase only.
After the post is tagged, other users can find it by typing in the tag in the search bar.
For example: your forum is about cars, a post is marked with the tags: “mercedes”
and “tuning,” when “mercedes” is typed in the search bar, all posts that are tagged
with “mercedes” should appear in the front-end.
A User must be able to add/remove/edit tags only on its own posts. Admins must be
able to add/remove/edit tags on all posts.
Firebase Realtime Database
All data should be stored in the document (NoSQL) database hosted by Google
Firebase. You must think of a way to organize your documents to achieve the
functionalities described above.
Use Cases
Scenario 1
A friend of Pavel’s told him about this amazing forum, where lots of people share
their ideas and perspectives on the crypto/stock market. Pavel enters the website
and sees a feed of posts. He can sort them by most liked or newest. He can also filter
them by a certain word/s. He is an anonymous user so he cannot create a post yet.
He registers and then logs in to the forum. He can now start sharing his ideas with
his buddy crypto “holders.”
Scenario 2
Your forum has accumulated thousands of new users. Most of them are proactively
helpful and positive, but some of them started posting spam or/and irrelevant
information to the forum. You hire a moderator. You instruct the moderator to enter
the forum and create a first-time registration. You as an admin give admin rights to
your moderator through the forum. They can now start deleting posts and ban users
that do not follow the forum rules!
Technical Requirements
General
• Follow OOP principles when coding (if and when applicable)
• Follow KISS, SOLID, DRY principles when coding
• Follow the functional programming principles (use pure functions, avoid side
effects, make use of array methos and higher-order functions where
applicable)
• Use tiered project structure (separate the application in layers)
• You should implement proper exception handling and propagation
• Try to think ahead. When developing something, think – “How hard would it
be to change/modify this later?”
Git
Commits in the GitHub repository should give a good overview of how the project
was developed, which features were created first and the people who contributed.
Contributions from all team members must be evident through the git commit
history! The repository must contain the complete application source code and any
scripts (database scripts, for example).
Provide a link to a GitHub repository with the following information in the
README.md file:
• Project description
• Link to the hosted project (if hosted online)
• Instructions on how to setup and run the project locally.
• Scheme (structure) of the documents in the database (must)
Optional Requirements
• Integrate your project with a Continuous Integration server and configure
your unit tests to run on each commit to your master branch
• Use branches while working with git
• Host the entire application in Firebase (Firebase Realtime Database +
Firebase Hosting)
Teamwork Guidelines
Please see the Teamwork Guidelines document.
Appendix
• Guidelines for URL encoding
• Git commits - an effective style guide
• How to Write a Git Commit Message


Project Presentation Guidelines
Regulations
• Please check your calendar for the date and time of the presentation of your
web projects.
• The order will be from the first team upwards.
• Try to fit within 8 minutes. The presentation can be slightly shorter or
longer, but not more than 10 minutes (let us respect others' time).
• Present the functionalities you have developed through the frontend, if
you have any. Of course, if there is any interesting backend part you want
to share, you could do so. Either way think how to engage the audience. Do
not do live code reviewing. If there is no frontend to use, use tools (such as
Postman) to show features and functionalities of your backend.
• It is desirable for every team member to participate in the presentation.
• You can conduct the presentation in a live demo format or pre-recorded.
On the day of the presentation
• Test your camera and audio before entering the meeting.
• Cameras must be on during the presentation.
• Be online at least 10 minutes early.
Tips
• Prepare quality test information for your presentation.
• Ensure that the content of your application is realistic (i.e., no placeholder
posts like "AAAAAA," "TEST TEST," gibberish, lorem ipsum, etc.).
• Your time is limited, so you will need to select the information you present:
o Start with a brief introduction (1-2 sentences) - who your team is, what
your project is called, and what it represents, including the main
technologies you have used.
o Highlight the main functionalities and/or those you are most proud of
and that set you apart.
o Do not explain what you have not done, show what you have done.
o Demonstrate your website's behavior on incorrect user input.
o You could add a pinch of appropriate humor – it significantly helps to
keep attention. However, remember that these projects will be present
in the resumes with which you will apply for jobs.
o Aim to make the presentation engaging and at a balanced pace –
enough for comprehension but not too monotonous. 
Choosing between a live demo and a pre-recorded presentation can significantly
impact the project presentation's effectiveness. A live demo offers the advantage of
interactivity, allowing presenters to display the functionality of their project in realtime and potentially address audience questions or feedback on the spot. It can
create a sense of immediacy and authenticity, providing a more immersive
experience for the audience. However, live demos also carry the risk of technical
glitches or performance issues, which could detract from the presentation. However,
a pre-recorded presentation offers greater control over the content and eliminates
the risk of unexpected interruptions. It allows presenters to polish their delivery and
ensure a smooth presentation. However, it may lack the spontaneity and
engagement of a live demo. The choice between the two formats depends on
factors such as the nature of the project, the preferences of the presenters, and the
technical considerations involved.
Rehearse
• Understand what you want to highlight and rehearse the presentation several
times. This way, you will determine if you can fit within the time and will
highlight the best parts of your project. It is always noticeable who has not
tried this way.
• Practice how control will be handed over during the presentation.
• It is best if each of you presents what they have outlined; if possible, make
such a division.
• If a Whitelabel/Server error occurs, continue confidently without explaining.
• If you encounter a local issue with the project, pass the ball to your teammate.
He/she can present their functionality and then get back to you once the
issue is resolved.
Bonus Tips
• Add create and insert scripts for the database.
• Save a stable version two days before the presentation day.
• You can include your tech stack, especially if you consume external APIs.
• If you have deployed the website on a Cloud Server, you can share the link.
• Add images to GitHub, Learn.
• During your presentation, set the same background in Teams to visually
appear as a team.
This is not an exam. It is your opportunity to display what you have
achieved in just a few months, and that is truly remarkable!



Teamwork Guidelines
Step 1 - Create your repository
• Create a new organization in GitHub (if there isn’t one already).
• Add your teammates as members to the organization.
• Create a new repository in the organization.
• Add the user javascript-trainers as a member and assign it a Read role. This
will automatically notify the trainers about your repo.
• Create a README.md file in your repository with details about your project.
Step 2 – Plan your tasks
How you organize you work is crucial to the success of the team. Create a Github
Issues board with the following data, fill it and keep it updated:
You can have several columns (lists) in the board:
• Open – the backlog of your project, containing all open issues
• To do – issues that have been assigned and scheduled with a deadline
• Doing – what issues are currently in progress (no more than 2 per person)
• For review – the issues that need to be reviewed by your teammates
• Closed – all issues that are done
You can use different issues for different purposes:
• Features:
o Name - the name of the card would be the given feature/task that needs
to be done.
o Size - what is the size of the feature in terms of programming effort i.e.,
Large/Medium/Small.
o Priority - what is the importance of the feature i.e., Must/Should/Could.
o Owner - who is responsible for the successful completion of the given
feature/task.
• Bugs:
o Name - the name of the card would be the given issue/problem of the
software that need to be fixed.
o Size - what is the size of the feature in terms of programming effort i.e.,
Large/Medium/Small.
o Priority - what is the importance of the feature i.e., Must/Should/Could.
o Owner - who is responsible for the successful completion of the given
feature/task.
• Ideas - any additional ideas for new features or improvements in the project.
o Name - the name of the card would be a short description of the idea that
occurred to you.
Reference: Github Issue Boards documentation
Step 3 – Coding!
Try to adhere to this project specification and make your project as close to it as
possible. Also, do not go crazy on features, implement a few but implement them
amazingly!
Always remember, quality over quantity!
Step 4 – Validation.
Review the code and test the behavior of the features of your team members. All
team members should be aware how a feature works, even if they were not the ones
to implement it.
Step 5 – Teamwork.
It is important that you work as a team towards a common goal:
• You should prepare a common plan that you agree to follow.
• You should take responsibility for your tasks.
• You should communicate and ask for details with regards to the project
implementation.
• You should be able to explain how you have contributed to the project.
• You should be able to explain the source code of your team members.
Step 6 – Give Feedback about Your Teammates.
You will be asked to provide feedback about your teammates, their attitude to this
project, their technical skills, their team working skills, their contribution to the
project, etc. The feedback is important part of the project evaluation so take it
seriously and be honest.
