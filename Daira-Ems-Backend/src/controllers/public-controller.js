import GuideBook from '../modals/GuideBook-model.js';

const getGuideBook = async (req, res) => {
  try {
    const guidebook = await GuideBook.findOne();
    if (guidebook) {
      res.status(200).json({ pdfFile: guidebook.pdfFile });
    } else {
      res.status(404).json({ message: 'GuideBook not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { getGuideBook };
