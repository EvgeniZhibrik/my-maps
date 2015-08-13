module.exports = function (mongoose){
    return {
        userSchema: new mongoose.Schema({
                active: Boolean,
                email: { type: String, trim: true, lowercase: true },
                firstName: { type: String, trim: true },
                lastName: { type: String, trim: true },
                avatar: { type: String, trim: true },
                friends: { type: [mongoose.Schema.Types.ObjectId], default: [] },
                created: { type: Date, default: Date.now },
                lastLogin: { type: Date, default: Date.now },
                details: mongoose.Schema.Types.Mixed
            },
            {
                collection: 'user' 
            }
        ),

        cafeSchema: new mongoose.Schema({
                name: {type: String, trim: true},
                website: {type: String, trim: true, default: ''},
                coordinates: {
                    latitude: {type: Number},
                    longitude: {type: Number}
                },
                description: {type: String, trim: true},
                publishedBy: { type: mongoose.Schema.Types.ObjectId },
                published: { type: Date},
                menu: mongoose.Schema.Types.Mixed
            },
            {
                collection: 'cafe'
            }
        ),

        fotoSchema: new mongoose.Schema({
                description: { type: String, trim: true, default:'' },
                title: { type: String, trim: true, default:'' },
                cafeID: { type: mongoose.Schema.Types.ObjectId },
                publishedBy: {type: mongoose.Schema.Types.ObjectId},
                published: { type: Date },
                link: { type: String, trim: true  }
            },
            {
                collection: 'foto' 
            }
        ),

        cafeCommentSchema: new mongoose.Schema({
                userID: { type: mongoose.Schema.Types.ObjectId },
                cafeID: { type: mongoose.Schema.Types.ObjectId },
                text: { type: String, trim: true},
                date: { type: Date }
            },
            {
                collection: 'cafeComment' 
            }
        ),

        marksSchema:  new mongoose.Schema({
                userID: { type: mongoose.Schema.Types.ObjectId },
                cafeID: { type: mongoose.Schema.Types.ObjectId },
                category: { type: mongoose.Schema.Types.ObjectId }, 
                mark: { type: Number }
            },
            {
                collection: 'marks' 
            }
        ),

        favoritesSchema:  new mongoose.Schema({
                userID: { type: mongoose.Schema.Types.ObjectId },
                cafeID: { type: mongoose.Schema.Types.ObjectId },
            },
            {
                collection: 'favorites' 
            }
        ),

        fotoCommentSchema:  new mongoose.Schema({
                userID: { type: mongoose.Schema.Types.ObjectId },
                fotoID: { type: mongoose.Schema.Types.ObjectId },
                text: { type: String, trim: true}, 
                date: { type: Date }
            },
            {
                collection: 'fotoComment' 
            }
        ),

        cafeCommentCommentSchema:  new mongoose.Schema({
                userID: { type: mongoose.Schema.Types.ObjectId },
                cafeCommentID: { type: mongoose.Schema.Types.ObjectId },
                text: {type: String, trim: true},
                date: { type: Date }
            },
            {
                collection: 'cafeCommentComment' 
            }
        ),

        newsSchema:  new mongoose.Schema({
                text: { type: String, trim: true},
                link: { type: String, trim: true},
                date: { type: Date }
            },
            {
                collection: 'news' 
            }
        ),

        newsCommentSchema:  new mongoose.Schema({
                userID: { type: mongoose.Schema.Types.ObjectId },
                newsID: { type: mongoose.Schema.Types.ObjectId },
                text: { type: String, trim: true},
                date: { type: Date }
            },
            {
                collection: 'newsComment' 
            }
        ),

        userFotoSchema: new mongoose.Schema({
                userID: { type: mongoose.Schema.Types.ObjectId },
                fotoID: { type: mongoose.Schema.Types.ObjectId }
            },
            {
                collection: 'userFoto' 
            }
        ),

        newsCafeSchema:  new mongoose.Schema({
                newsID: { type: mongoose.Schema.Types.ObjectId },
                cafeID: { type: mongoose.Schema.Types.ObjectId }
            },
            {
                collection: 'newsCafe' 
            }
        ),

        discussionSchema: new mongoose.Schema({
                title: { type: String, trim: true},
                createdBy: { type: mongoose.Schema.Types.ObjectId},
                created: {type: Date, default: Date.now}
            },
            {
                collection: 'discussion' 
            }
        ),

        discussionCommentSchema:  new mongoose.Schema({
                userID: { type: mongoose.Schema.Types.ObjectId },
                discussionID: { type: mongoose.Schema.Types.ObjectId },
                text: { type: String, trim: true},
                date: { type: Date }
            },
            {
                collection: 'discussionComment' 
            }
        ),

        userDiscussionSchema:  new mongoose.Schema({
                userID: { type: mongoose.Schema.Types.ObjectId },
                discussionID: { type: mongoose.Schema.Types.ObjectId }
            },
            {
                collection: 'userDiscussion' 
            }
        ),

        rankingSchema:  new mongoose.Schema({
                category: { type: String, trim: true}
            },
            {
                collection: 'ranking' 
            }
        )
    }
}