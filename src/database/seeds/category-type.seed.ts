import { CategoryType } from 'src/modules/category/domain/entities/category-type.entity';
import { DataSource } from 'typeorm';

export const categoryTypeSeed = async (dataSource: DataSource) => {
  const categoryTypeRepository = dataSource.getRepository(CategoryType);

  const categoryTypes = [
    {
      name: 'Fashion',
      description:
        'Campaigns related to clothing, accessories, trends, and personal style.',
    },
    {
      name: 'Beauty',
      description:
        'Covers skincare, haircare, makeup, grooming, and cosmetic products.',
    },
    {
      name: 'Lifestyle',
      description:
        'General lifestyle content including daily routines, inspiration, and aesthetics.',
    },
    {
      name: 'Tech',
      description:
        'Focused on innovation, gadgets, software, apps, and emerging technologies.',
    },
    {
      name: 'Gaming',
      description:
        'Video games, gaming reviews, live streams, esports, and gaming culture.',
    },
    {
      name: 'Business',
      description:
        'Covers business ideas, entrepreneurship, branding, and business growth strategies.',
    },
    {
      name: 'Finance',
      description:
        'Content about money management, savings, investing, budgeting, and financial education.',
    },
    {
      name: 'Food',
      description:
        'Cooking tutorials, recipes, food reviews, restaurant promotions, and meal content.',
    },
    {
      name: 'Fitness',
      description:
        'Workout routines, physical training, exercise tips, and active lifestyle content.',
    },
    {
      name: 'Health',
      description:
        'General health awareness including medical advice, wellness, and preventive care.',
    },
    {
      name: 'Travel',
      description:
        'Travel destinations, tourism campaigns, hotels, adventure and outdoor experiences.',
    },
    {
      name: 'Entertainment',
      description:
        'Pop culture, movies, TV shows, celebrity news, fun content, and entertainment media.',
    },
    {
      name: 'Music',
      description:
        'Music promotions, song releases, artists, instruments, and music lifestyle content.',
    },
    {
      name: 'Sports',
      description:
        'Sports commentary, match highlights, training, and athletic promotions.',
    },
    {
      name: 'Parenting',
      description:
        'Tips for parents, family life, child care, baby products and parenting lifestyle.',
    },
    {
      name: 'Education',
      description:
        'Learning materials, study tips, academic programs, and skill-building content.',
    },
    {
      name: 'Religion',
      description:
        'Faith-based content including teachings, spiritual advice, and worship activities.',
    },
    {
      name: 'Culture',
      description:
        'Cultural traditions, lifestyle, heritage celebrations, and community values.',
    },
    {
      name: 'Automotive',
      description:
        'Cars, bikes, auto reviews, driving experiences, and automotive products.',
    },
    {
      name: 'Real Estate',
      description:
        'Property promotions, housing markets, interior tours, and investment properties.',
    },
    {
      name: 'Personal Development',
      description:
        'Self-improvement content including mindset, productivity, and personal growth.',
    },
    {
      name: 'Sustainability',
      description:
        'Eco-friendly content, environmental activism, and sustainable lifestyle campaigns.',
    },
    {
      name: 'Comedy & Skits',
      description:
        'Humorous content, short skits, comedic storytelling, and viral entertainment.',
    },
    {
      name: 'Luxury',
      description:
        'High-end products, exclusive brands, luxury lifestyle, and premium services.',
    },
    {
      name: 'Product Reviews',
      description:
        'Reviews of products, unboxing videos, comparisons, and consumer recommendations.',
    },
  ];
  for (const type of categoryTypes) {
    const exists = await categoryTypeRepository.findOne({
      where: { name: type.name },
    });
    if (!exists) {
      await categoryTypeRepository.save(type);
    }
  }

  console.log('✅ Category Type seeded successfully.');
};
