import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  languages: {
    type: [String],
    required: true,
  },
  roles: {
    type: [String],
    required: true,
  },
  tools:{
    type: [String],
    set: (arr) => arr.map(str => str.toLowerCase())
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  github: {
    type: String,
    validate: {
      validator: function (v) {
        return /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/.test(v);
      },
      message: props => `${props.value} is not a valid GitHub profile URL!`,
    },
    required: true,
  },
  rating: {
    type: [Number], // [averageRating, numberOfRaters]
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length === 2;
      },
      message: 'Rating must be an array of two numbers: [average, number of raters]',
    },
    default: [0.0, 0],
  },
}, {
  timestamps: true,
});

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
