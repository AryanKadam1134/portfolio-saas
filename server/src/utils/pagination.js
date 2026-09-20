const paginateQuery = async ({
  model,
  page = 1,
  limit = 10,
  filter = {},
  sort = { createdAt: -1 },
  populate = "",
}) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find(filter).sort(sort).skip(skip).limit(limit).populate(populate),
    model.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      total: Number(total),
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

const paginateAggregate = async ({
  model,
  pipeline = [],
  page = 1,
  limit = 10,
}) => {
  const parsedPage = Number(page) || 1;
  const parsedLimit = Number(limit) || 10;

  const safePage = parsedPage < 1 ? 1 : parsedPage;
  const safeLimit = parsedLimit < 1 ? 10 : parsedLimit;

  const skip = (safePage - 1) * safeLimit;

  const [facetResult] = await model.aggregate([
    ...pipeline,
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: safeLimit }],
        total: [{ $count: "count" }],
      },
    },
  ]);

  const total = facetResult?.total?.[0]?.count || 0;

  return {
    data: facetResult?.data || [],
    pagination: {
      total: Number(total),
      page: Number(safePage),
      limit: Number(safeLimit),
      totalPages: total === 0 ? 0 : Math.ceil(total / safeLimit),
    },
  };
};

export { paginateQuery, paginateAggregate };
