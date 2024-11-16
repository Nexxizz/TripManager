import { RouteProps, Navigate, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/home/HomePage';
import { AddTrip } from './pages/home/AddTrip';
import { AddDestination } from './pages/home/AddDestination';

export type RouteConfig = RouteProps & {
    /**
     * Required route path.   * E.g. /home   */
    path: string;
};

export const routes: RouteConfig[] = [
    {
        path: "/",
        element: <Navigate to="/home" replace />,
        index: true,
    },
    {
        path: "/home",
        element: <HomePage />,
    },
    {
        path: "/addTrip",
        element: <AddTrip />,
    },
    {
        path: "/addDestination",
        element: <AddDestination />,
    },
];

const renderRouteMap = (route: RouteConfig) => {
    const { element, ...rest } = route;

    return <Route key={route.path} element = {element} {...rest} />;
};

export const AppRoutes = () => {
    return <Routes>{routes.map(renderRouteMap)}</Routes>;
};